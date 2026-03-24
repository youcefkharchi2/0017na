const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// مهم مع Render (HTTPS)
app.set('trust proxy', 1);

// إعدادات
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Session (مصلوحة)
app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "none"
  }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Discord Login
passport.use(new DiscordStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "https://zero017na.onrender.com/auth/callback",
  scope: ["identify", "guilds"]
},
(accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// Routes
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.get('/login', passport.authenticate('discord'));

app.get('/auth/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => {
    console.log("LOGIN SUCCESS");
    res.redirect('/dashboard');
  }
);

app.get('/dashboard', (req, res) => {
  if (!req.user) {
    console.log("NO USER");
    return res.redirect('/');
  }

  res.render('dashboard', { user: req.user });
});

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).send("Server Error");
});

app.listen(PORT, () => {
  console.log("Server running...");
});
