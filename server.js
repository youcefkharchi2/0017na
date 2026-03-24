const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (HTML, CSS, video, etc.)
app.use(express.static(path.join(__dirname)));

// أي زائر يدخل على "/" → نوجهه مباشرة إلى login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// بعد تسجيل الدخول عبر Discord (redirect) → نوجهه للصفحة الرئيسية
app.get('/redirect', (req, res) => {
  const code = req.query.code;

  // هنا يمكنك التحقق من الكود مع Discord API إذا تحب
  // بعد التأكد، توجه المستخدم إلى index.html
  res.redirect('/index.html');
});

// Optional: dashboard أو مسارات أخرى
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
