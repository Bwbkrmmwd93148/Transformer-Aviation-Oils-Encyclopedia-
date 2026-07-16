const translations = require('../locales/translations.json');

const SUPPORTED_LANGUAGES = ['ar', 'en', 'fr', 'de', 'es', 'it', 'pt', 'ja', 'zh', 'ru'];

// Middleware for language detection and translation
const i18nMiddleware = (req, res, next) => {
  // Get language from query parameter, cookie, or browser preference
  let language = req.query.lang || req.cookies.language || 'ar';

  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    language = 'ar'; // Default to Arabic
  }

  // Set language in response locals
  res.locals.language = language;
  res.locals.t = (key) => {
    const keys = key.split('.');
    let translation = translations[language] || translations['ar'];
    
    for (const k of keys) {
      translation = translation[k];
      if (!translation) {
        return key; // Return key if translation not found
      }
    }
    
    return translation;
  };

  // Set cookie for language preference
  res.cookie('language', language, { maxAge: 365 * 24 * 60 * 60 * 1000 });

  next();
};

// Get all supported languages
const getLanguages = () => {
  return SUPPORTED_LANGUAGES.map(lang => ({
    code: lang,
    name: translations[lang].language
  }));
};

// Get translation for a specific language
const getTranslation = (key, language = 'ar') => {
  const keys = key.split('.');
  let translation = translations[language] || translations['ar'];
  
  for (const k of keys) {
    translation = translation[k];
    if (!translation) {
      return key;
    }
  }
  
  return translation;
};

module.exports = {
  i18nMiddleware,
  getLanguages,
  getTranslation,
  SUPPORTED_LANGUAGES,
  translations
};
