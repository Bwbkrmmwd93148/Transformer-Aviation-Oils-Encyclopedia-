const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Category = require('../models/Category');
const Comment = require('../models/Comment');

// Get Articles API
router.get('/articles', async (req, res) => {
  try {
    const language = req.query.lang || 'ar';
    const category_id = req.query.category || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const articles = await Article.getAll({
      category_id,
      language,
      limit,
      offset
    });

    const total = await Article.getCount(category_id, language);

    res.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching articles'
    });
  }
});

// Get Single Article API
router.get('/articles/:id', async (req, res) => {
  try {
    const language = req.query.lang || 'ar';
    const article = await Article.getById(req.params.id, language);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching article'
    });
  }
});

// Get Categories API
router.get('/categories', async (req, res) => {
  try {
    const type = req.query.type || null;
    const categories = await Category.getWithArticleCount(type);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

// Get Comments API
router.get('/articles/:articleId/comments', async (req, res) => {
  try {
    const comments = await Comment.getByArticle(req.params.articleId, true);
    const ratingInfo = await Comment.getAverageRating(req.params.articleId);

    res.json({
      success: true,
      data: {
        comments,
        rating: ratingInfo
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments'
    });
  }
});

// Search API
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const language = req.query.lang || 'ar';
    const limit = parseInt(req.query.limit) || 20;

    if (query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const results = await Article.getAll({
      language,
      search: query,
      limit
    });

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({
      success: false,
      message: 'Error in search'
    });
  }
});

module.exports = router;
