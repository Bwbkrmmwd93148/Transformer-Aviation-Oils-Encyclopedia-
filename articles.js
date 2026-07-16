const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Category = require('../models/Category');
const Comment = require('../models/Comment');

// Articles by Category
router.get('/category/:categorySlug', async (req, res) => {
  try {
    const language = req.session.language || 'ar';
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    const category = await Category.getBySlug(req.params.categorySlug);
    if (!category) {
      return res.status(404).render('404', { title: 'Category Not Found' });
    }

    const articles = await Article.getAll({
      category_id: category.id,
      language,
      limit,
      offset
    });

    const total = await Article.getCount(category.id, language);
    const totalPages = Math.ceil(total / limit);

    res.render('category', {
      title: category.slug,
      category,
      articles,
      page,
      totalPages,
      language
    });
  } catch (error) {
    console.error('Error loading category:', error);
    res.status(500).render('500', { title: 'Server Error' });
  }
});

// Single Article
router.get('/:slug', async (req, res) => {
  try {
    const language = req.session.language || 'ar';
    const article = await Article.getBySlug(req.params.slug, language);

    if (!article) {
      return res.status(404).render('404', { title: 'Article Not Found' });
    }

    // Get related articles
    const related = await Article.getRelated(article.category_id, article.id, 4);

    // Get comments
    const comments = await Comment.getByArticle(article.id, true);
    const ratingInfo = await Comment.getAverageRating(article.id);

    res.render('article', {
      title: article.title,
      article,
      related,
      comments,
      ratingInfo,
      language
    });
  } catch (error) {
    console.error('Error loading article:', error);
    res.status(500).render('500', { title: 'Server Error' });
  }
});

// Add Comment
router.post('/:articleId/comment', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      });
    }

    const { content, rating } = req.body;
    
    if (!content || content.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'التعليق قصير جداً'
      });
    }

    const commentId = await Comment.create({
      article_id: req.params.articleId,
      user_id: req.session.user.id,
      content,
      rating: rating ? parseInt(rating) : null
    });

    res.json({
      success: true,
      message: 'تم إضافة التعليق بنجاح (في انتظار الموافقة)',
      commentId
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إضافة التعليق'
    });
  }
});

module.exports = router;
