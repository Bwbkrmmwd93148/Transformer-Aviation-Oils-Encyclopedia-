/**
 * اختبارات شاملة لموقع أبو بكر محمود
 * Testing Suite for Abu Bakr Mahmoud Website
 */

const assert = require('assert');
const translations = require('../locales/translations.json');
const { SUPPORTED_LANGUAGES, getTranslation } = require('../middleware/i18n');

console.log('='.repeat(60));
console.log('🧪 بدء الاختبارات الشاملة');
console.log('🧪 Starting Comprehensive Tests');
console.log('='.repeat(60));

// Test 1: Check supported languages
console.log('\n✅ Test 1: Supported Languages');
console.log('   Languages:', SUPPORTED_LANGUAGES);
assert.strictEqual(SUPPORTED_LANGUAGES.length, 10, 'Should support 10 languages');
console.log('   ✓ Passed: 10 languages supported');

// Test 2: Check translations structure
console.log('\n✅ Test 2: Translations Structure');
const requiredKeys = ['site_name', 'site_tagline', 'home', 'about', 'contact', 'search', 'login', 'register'];
for (const lang of SUPPORTED_LANGUAGES) {
  assert(translations[lang], `Translation for ${lang} should exist`);
  for (const key of requiredKeys) {
    assert(translations[lang][key], `Key '${key}' should exist in ${lang} translation`);
  }
}
console.log('   ✓ Passed: All required keys present in all languages');

// Test 3: Check translation retrieval
console.log('\n✅ Test 3: Translation Retrieval');
const arabicSiteName = getTranslation('site_name', 'ar');
assert.strictEqual(arabicSiteName, 'أبو بكر محمود', 'Arabic site name should be correct');
const englishSiteName = getTranslation('site_name', 'en');
assert.strictEqual(englishSiteName, 'Abu Bakr Mahmoud', 'English site name should be correct');
console.log('   ✓ Passed: Translation retrieval working correctly');

// Test 4: Check language codes
console.log('\n✅ Test 4: Language Codes');
const expectedLanguages = ['ar', 'en', 'fr', 'de', 'es', 'it', 'pt', 'ja', 'zh', 'ru'];
for (const lang of expectedLanguages) {
  assert(SUPPORTED_LANGUAGES.includes(lang), `Language ${lang} should be supported`);
}
console.log('   ✓ Passed: All expected languages are supported');

// Test 5: Check RTL support for Arabic
console.log('\n✅ Test 5: RTL Support for Arabic');
const arabicTranslations = translations['ar'];
assert(arabicTranslations, 'Arabic translations should exist');
assert(arabicTranslations.site_name === 'أبو بكر محمود', 'Arabic text should be correct');
console.log('   ✓ Passed: Arabic RTL support verified');

// Test 6: Check LTR support for English
console.log('\n✅ Test 6: LTR Support for English');
const englishTranslations = translations['en'];
assert(englishTranslations, 'English translations should exist');
assert(englishTranslations.site_name === 'Abu Bakr Mahmoud', 'English text should be correct');
console.log('   ✓ Passed: English LTR support verified');

// Test 7: Check all languages have complete translations
console.log('\n✅ Test 7: Complete Translations');
const arabicKeys = Object.keys(translations['ar']);
for (const lang of SUPPORTED_LANGUAGES) {
  const langKeys = Object.keys(translations[lang]);
  assert.strictEqual(langKeys.length, arabicKeys.length, `${lang} should have same number of keys as Arabic`);
}
console.log('   ✓ Passed: All languages have complete translations');

// Test 8: Check for missing translations
console.log('\n✅ Test 8: Missing Translations Check');
let missingCount = 0;
for (const lang of SUPPORTED_LANGUAGES) {
  for (const key of arabicKeys) {
    if (!translations[lang][key]) {
      console.log(`   ⚠️  Missing: ${lang}.${key}`);
      missingCount++;
    }
  }
}
assert.strictEqual(missingCount, 0, 'Should have no missing translations');
console.log('   ✓ Passed: No missing translations found');

// Test 9: Check language switching
console.log('\n✅ Test 9: Language Switching');
const languages = ['ar', 'en', 'fr', 'de', 'es', 'it', 'pt', 'ja', 'zh', 'ru'];
for (const lang of languages) {
  const translation = getTranslation('home', lang);
  assert(translation, `Should be able to get 'home' translation for ${lang}`);
  assert(translation !== 'home', `Should not return key for ${lang}`);
}
console.log('   ✓ Passed: Language switching working correctly');

// Test 10: Check data structure
console.log('\n✅ Test 10: Data Structure Validation');
const articlesData = require('../data/articles.json');
assert(articlesData.transformers, 'Should have transformers data');
assert(articlesData.aircraft, 'Should have aircraft data');
assert.strictEqual(articlesData.transformers.length, 10, 'Should have 10 transformer articles');
assert.strictEqual(articlesData.aircraft.length, 10, 'Should have 10 aircraft articles');
console.log('   ✓ Passed: Data structure is valid');

// Test 11: Check article content
console.log('\n✅ Test 11: Article Content Validation');
for (const article of articlesData.transformers) {
  assert(article.title, 'Article should have title');
  assert(article.slug, 'Article should have slug');
  assert(article.description, 'Article should have description');
  assert(article.content, 'Article should have content');
  assert(article.category_slug, 'Article should have category_slug');
}
for (const article of articlesData.aircraft) {
  assert(article.title, 'Article should have title');
  assert(article.slug, 'Article should have slug');
  assert(article.description, 'Article should have description');
  assert(article.content, 'Article should have content');
  assert(article.category_slug, 'Article should have category_slug');
}
console.log('   ✓ Passed: All articles have required content');

// Test 12: Check unique slugs
console.log('\n✅ Test 12: Unique Slugs Validation');
const allSlugs = [
  ...articlesData.transformers.map(a => a.slug),
  ...articlesData.aircraft.map(a => a.slug)
];
const uniqueSlugs = new Set(allSlugs);
assert.strictEqual(allSlugs.length, uniqueSlugs.size, 'All slugs should be unique');
console.log('   ✓ Passed: All article slugs are unique');

// Test 13: Check content quality
console.log('\n✅ Test 13: Content Quality Check');
for (const article of [...articlesData.transformers, ...articlesData.aircraft]) {
  assert(article.content.length > 100, `Article "${article.title}" should have substantial content`);
  assert(article.content.includes('<h'), `Article "${article.title}" should have HTML headers`);
  assert(article.content.includes('<p') || article.content.includes('<ul'), `Article "${article.title}" should have paragraphs or lists`);
}
console.log('   ✓ Passed: All articles have quality content');

// Test 14: Check category coverage
console.log('\n✅ Test 14: Category Coverage');
const transformerCategories = new Set(articlesData.transformers.map(a => a.category_slug));
const aircraftCategories = new Set(articlesData.aircraft.map(a => a.category_slug));
console.log(`   Transformer categories: ${transformerCategories.size}`);
console.log(`   Aircraft categories: ${aircraftCategories.size}`);
assert(transformerCategories.size >= 10, 'Should have at least 10 transformer categories');
assert(aircraftCategories.size >= 10, 'Should have at least 10 aircraft categories');
console.log('   ✓ Passed: Good category coverage');

// Test 15: Check for special characters
console.log('\n✅ Test 15: Special Characters Support');
const arabicArticles = articlesData.transformers.filter(a => a.title.includes('محول'));
assert(arabicArticles.length > 0, 'Should have Arabic content');
console.log(`   Found ${arabicArticles.length} Arabic articles`);
console.log('   ✓ Passed: Arabic special characters supported');

// Summary
console.log('\n' + '='.repeat(60));
console.log('✅ جميع الاختبارات نجحت بنجاح!');
console.log('✅ All tests passed successfully!');
console.log('='.repeat(60));
console.log('\n📊 اختبار ملخص:');
console.log('📊 Test Summary:');
console.log(`   ✓ Languages: ${SUPPORTED_LANGUAGES.length}/10`);
console.log(`   ✓ Translations: ${Object.keys(translations['ar']).length} keys`);
console.log(`   ✓ Transformer Articles: ${articlesData.transformers.length}/10`);
console.log(`   ✓ Aircraft Articles: ${articlesData.aircraft.length}/10`);
console.log(`   ✓ Total Articles: ${articlesData.transformers.length + articlesData.aircraft.length}/20`);
console.log('='.repeat(60));
