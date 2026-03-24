const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

let settings = {
  prefix: "!",
  welcome: "on"
};

app.get('/', (req, res) => {
  res.render('index', { settings });
});

app.post('/save', (req, res) => {
  settings.prefix = req.body.prefix;
  settings.welcome = req.body.welcome;
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log("Site running...");
});
