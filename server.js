const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// إعدادات
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

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
    res.redirect('/dashboard');
  }
);

app.get('/dashboard', (req, res) => {
  if (!req.user) return res.redirect('/');
  res.render('dashboard', { user: req.user });
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log("Server running...");
});
