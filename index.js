const express = require('express');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { i18nMiddleware } = require('../middleware/i18n');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Body Parser Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// i18n Middleware for multi-language support
app.use(i18nMiddleware);

// Middleware to pass user data to views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentLanguage = req.session.language || res.locals.language || 'ar';
  next();
});

// Routes
app.use('/', require('../routes/home'));
app.use('/articles', require('../routes/articles'));
app.use('/auth', require('../routes/auth'));
app.use('/admin', require('../routes/admin'));
app.use('/api', require('../routes/api'));

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { 
    title: 'Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`📚 Supported Languages: ar, en, fr, de, es, it, pt, ja, zh, ru`);
  console.log(`🌐 Change language: http://localhost:${PORT}/?lang=en`);
});

module.exports = app;
