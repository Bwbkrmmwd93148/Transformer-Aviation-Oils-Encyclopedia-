const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Category = require('../models/Category');

// Home Page
router.get('/', async (req, res) => {
  try {
    const language = req.query.lang || req.session.language || 'ar';
    req.session.language = language;

    // Get featured articles
    const featured = await Article.getPopular(language, 6);
    
    // Get categories with article counts
    const transformerCategories = await Category.getWithArticleCount('transformer');
    const aircraftCategories = await Category.getWithArticleCount('aircraft');

    res.render('index', {
      title: 'أبو بكر محمود - زيوت المحولات والطائرات',
      featured,
      transformerCategories,
      aircraftCategories,
      language
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.status(500).render('500', { title: 'Server Error' });
  }
});

// Search
router.get('/search', async (req, res) => {
  try {
    const language = req.session.language || 'ar';
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    if (query.length < 2) {
      return res.render('search', {
        title: 'بحث',
        results: [],
        query: '',
        page: 1,
        totalPages: 0,
        language
      });
    }

    const results = await Article.getAll({
      language,
      search: query,
      limit,
      offset
    });

    const total = await Article.getCount(null, language);
    const totalPages = Math.ceil(total / limit);

    res.render('search', {
      title: `نتائج البحث عن: ${query}`,
      results,
      query,
      page,
      totalPages,
      language
    });
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).render('500', { title: 'Server Error' });
  }
});

// About Page
router.get('/about', (req, res) => {
  const language = req.session.language || 'ar';
  res.render('about', {
    title: 'عن الموقع',
    language
  });
});

// Contact Page
router.get('/contact', (req, res) => {
  const language = req.session.language || 'ar';
  res.render('contact', {
    title: 'اتصل بنا',
    language
  });
});

// Contact Form Submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // TODO: Send email or save to database
    console.log('Contact form submission:', { name, email, subject, message });

    res.json({
      success: true,
      message: 'تم استلام رسالتك بنجاح'
    });
  } catch (error) {
    console.error('Error in contact form:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال الرسالة'
    });
  }
});

module.exports = router;
