const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

const app = express();
const port = process.env.PORT || 3000;

// 🌐 Discord credentials
const CLIENT_ID = "1486022873821876224";
const CLIENT_SECRET = "CLPbqp4nNlmJdbDJusjBZkMz6A27rpuG";
const CALLBACK_URL = "https://zero017na.onrender.com/auth/discord/callback";

// ================== PASSPORT ==================
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: CALLBACK_URL,
  scope: ["identify", "guilds"]
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => done(null, profile));
}));

// ================== MIDDLEWARE ==================
app.set('trust proxy', 1); // مهم على Render

app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24h
    secure: process.env.NODE_ENV === "production", // true على Render
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname)));

// ================== ROUTES ==================

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 🔐 تسجيل الدخول
app.get('/auth/discord', passport.authenticate('discord'));

// 🔁 Callback من Discord
app.get('/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// 🔎 Check session (frontend)
app.get('/check-session', (req, res) => {
  res.json({ loggedIn: req.isAuthenticated() });
});

// 🧠 Dashboard محمية
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.send(`
      <h2 style="color:red;text-align:center;margin-top:50px;">
        ❌ لازم تسجل الدخول أولاً
      </h2>
      <p style="text-align:center;"><a href="/">الرجوع للرئيسية</a></p>
    `);
  }

  const user = req.user;

  res.send(`
    <html>
    <head>
      <title>Dashboard</title>
      <style>
        body {
          background: #0f172a;
          color: white;
          text-align: center;
          font-family: sans-serif;
          padding-top: 50px;
        }
        img { border-radius: 50%; }
        a { color: #38bdf8; text-decoration: none; display: inline-block; margin-top: 20px; }
      </style>
    </head>
    <body>
      <h1>مرحبا ${user.username} 👋</h1>
      <img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png" width="100">
      <p>راك داخل بنجاح 🔥</p>
      <a href="/logout">🚪 تسجيل الخروج</a>
    </body>
    </html>
  `);
});

// 🚪 تسجيل الخروج
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// ❌ 404
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// ================== START SERVER ==================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
