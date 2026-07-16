const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Register Page
router.get('/register', (req, res) => {
  const language = req.session.language || 'ar';
  res.render('auth/register', {
    title: 'تسجيل حساب جديد',
    language
  });
});

// Register Submit
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('اسم المستخدم قصير جداً'),
  body('email').isEmail().withMessage('البريد الإلكتروني غير صحيح'),
  body('password').isLength({ min: 6 }).withMessage('كلمة المرور قصيرة جداً'),
  body('full_name').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, email, password, full_name } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل بالفعل'
      });
    }

    const userId = await User.create({
      username,
      email,
      password,
      full_name,
      role: 'user'
    });

    req.session.user = {
      id: userId,
      username,
      email,
      full_name,
      role: 'user'
    };

    res.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      redirect: '/'
    });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التسجيل'
    });
  }
});

// Login Page
router.get('/login', (req, res) => {
  const language = req.session.language || 'ar';
  res.render('auth/login', {
    title: 'تسجيل الدخول',
    language
  });
});

// Login Submit
router.post('/login', [
  body('email').isEmail().withMessage('البريد الإلكتروني غير صحيح'),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'الحساب معطل'
      });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    };

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      redirect: '/'
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل الدخول'
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

// Profile Page
router.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const language = req.session.language || 'ar';
  res.render('auth/profile', {
    title: 'ملفي الشخصي',
    user: req.session.user,
    language
  });
});

module.exports = router;
