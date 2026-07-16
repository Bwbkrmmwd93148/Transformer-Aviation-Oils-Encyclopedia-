const pool = require('../config/database');

class Article {
  static async getAll(options = {}) {
    const { 
      category_id = null, 
      language = 'ar', 
      limit = 10, 
      offset = 0,
      search = null 
    } = options;

    let query = `
      SELECT a.*, c.slug as category_slug, u.full_name as author_name
      FROM articles a
      JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.is_published = TRUE AND a.language_code = ?
    `;
    
    const params = [language];

    if (category_id) {
      query += ` AND a.category_id = ?`;
      params.push(category_id);
    }

    if (search) {
      query += ` AND (a.title LIKE ? OR a.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getById(id, language = 'ar') {
    const query = `
      SELECT a.*, c.slug as category_slug, u.full_name as author_name
      FROM articles a
      JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ? AND a.language_code = ?
    `;
    
    const [rows] = await pool.query(query, [id, language]);
    
    if (rows.length > 0) {
      // Increment views
      await pool.query('UPDATE articles SET views_count = views_count + 1 WHERE id = ?', [id]);
      return rows[0];
    }
    
    return null;
  }

  static async getBySlug(slug, language = 'ar') {
    const query = `
      SELECT a.*, c.slug as category_slug, u.full_name as author_name
      FROM articles a
      JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.slug = ? AND a.language_code = ?
    `;
    
    const [rows] = await pool.query(query, [slug, language]);
    
    if (rows.length > 0) {
      // Increment views
      await pool.query('UPDATE articles SET views_count = views_count + 1 WHERE id = ?', [rows[0].id]);
      return rows[0];
    }
    
    return null;
  }

  static async create(data) {
    const query = `
      INSERT INTO articles (category_id, slug, title, description, content, featured_image, author_id, language_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      data.category_id,
      data.slug,
      data.title,
      data.description,
      data.content,
      data.featured_image,
      data.author_id,
      data.language_code || 'ar'
    ]);
    
    return result.insertId;
  }

  static async update(id, data) {
    let query = 'UPDATE articles SET ';
    const params = [];
    const fields = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    }

    query += fields.join(', ') + ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);
  }

  static async delete(id) {
    await pool.query('DELETE FROM articles WHERE id = ?', [id]);
  }

  static async getRelated(category_id, current_id, limit = 5) {
    const query = `
      SELECT * FROM articles
      WHERE category_id = ? AND id != ? AND is_published = TRUE
      ORDER BY created_at DESC
      LIMIT ?
    `;
    
    const [rows] = await pool.query(query, [category_id, current_id, limit]);
    return rows;
  }

  static async getPopular(language = 'ar', limit = 10) {
    const query = `
      SELECT * FROM articles
      WHERE is_published = TRUE AND language_code = ?
      ORDER BY views_count DESC
      LIMIT ?
    `;
    
    const [rows] = await pool.query(query, [language, limit]);
    return rows;
  }

  static async getCount(category_id = null, language = 'ar') {
    let query = 'SELECT COUNT(*) as total FROM articles WHERE is_published = TRUE AND language_code = ?';
    const params = [language];

    if (category_id) {
      query += ' AND category_id = ?';
      params.push(category_id);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }
}

module.exports = Article;
