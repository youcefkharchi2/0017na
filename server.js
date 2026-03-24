// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (HTML, CSS, video, etc.)
app.use(express.static(path.join(__dirname)));

// الصفحة الرئيسية: توجه لأي زائر إلى login.html أولاً
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Redirect بعد تسجيل الدخول عبر Discord
app.get('/redirect', (req, res) => {
  const code = req.query.code;

  // هنا يمكن تبادل الكود مع Discord API للحصول على user info
  // بعد التأكد، نوجه المستخدم مباشرة إلى الصفحة الرئيسية
  res.redirect('/index.html');
});

// Optional: صفحة dashboard أو أي مسارات أخرى
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
