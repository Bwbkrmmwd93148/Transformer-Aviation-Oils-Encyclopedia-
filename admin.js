const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Category = require('../models/Category');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Admin Middleware
const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).render('403', { title: 'Access Denied' });
  }
  next();
};

// Admin Dashboard
router.get('/', requireAdmin, async (req, res) => {
  try {
    const language = req.session.language || 'ar';
    
    // Get statistics
    const totalArticles = await Article.getCount();
    const pendingComments = await Comment.getPending();
    const totalUsers = await User.getCount();

    res.render('admin/dashboard', {
      title: 'لوحة التحكم',
      totalArticles,
      pendingComments: pendingComments.length,
      totalUsers,
      language
    });
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    res.status(500).render('500', { title: 'Server Error' });
  }
});

// Manage Articles
router.get('/articles', requireAdmin, async (req, res) => {
  try {
    const language = req.session.language || 'ar';
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const articles = await Article.getAll({
      language,
      limit,
      offset
    });

    const total = await Article.getCount();
    const totalPages = Math.ceil(total / limit);

    res.render('admin/articles', {
      title: 'إدارة المقالات',
      articles,
      page,
      totalPages,
      language
    });
  } catch (error) {
    console.error('Error loading articles:', error);
    res.status(500).render('500', { title: 'Server Error' });
  }
});

// Create Article
router.get('/articles/create', requireAdmin, async (req, res) => {
  try {
    const language = req.session.language || 'ar';
    const categories = await Category.getAll();

    res.render('admin/create-article', {
      title: 'إنشاء مقالة جديدة',
      categories,
      language
    });
  } catch (error) {
    console.error('Error loading create article:', error);
    res.status(500).render('500', { title: 'Server Error' });
  }
});

// Save Article
router.post('/articles', requireAdmin, async (req, res) => {
  try {
    const { category_id, title, description, content, featured_image } = req.body;
    
    // Create slug from title
    const slug = title.toLowerCase().replace(/\s+/g, '-');

    const articleId = await Article.create({
      category_id,
      slug,
      title,
      description,
      content,
      featured_image,
      author_id: req.session.user.id,
      language_code: req.session.language || 'ar'
    });

    res.json({
      success: true,
      message: 'تم إنشاء المقالة بنجاح',
      articleId
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء المقالة'
    });
  }
});

// Manage Comments
router.get('/comments', requireAdmin, async (req, res) => {
  try {
    const language = req.session.language || 'ar';
    const pendingComments = await Comment.getPending();

    res.render('admin/comments', {
      title: 'إدارة التعليقات',
      comments: pendingComments,
      language
    });
  } catch (error) {
    console.error('Error loading comments:', error);
    res.status(500).render('500', { title: 'Server Error' });
  }
});

// Approve Comment
router.post('/comments/:id/approve', requireAdmin, async (req, res) => {
  try {
    await Comment.approve(req.params.id);
    res.json({
      success: true,
      message: 'تم الموافقة على التعليق'
    });
  } catch (error) {
    console.error('Error approving comment:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ'
    });
  }
});

// Reject Comment
router.post('/comments/:id/reject', requireAdmin, async (req, res) => {
  try {
    await Comment.reject(req.params.id);
    res.json({
      success: true,
      message: 'تم رفض التعليق'
    });
  } catch (error) {
    console.error('Error rejecting comment:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ'
    });
  }
});

// Manage Users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const language = req.session.language || 'ar';
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const users = await User.getAll(limit, offset);
    const total = await User.getCount();
    const totalPages = Math.ceil(total / limit);

    res.render('admin/users', {
      title: 'إدارة المستخدمين',
      users,
      page,
      totalPages,
      language
    });
  } catch (error) {
    console.error('Error loading users:', error);
    res.status(500).render('500', { title: 'Server Error' });
  }
});

module.exports = router;
