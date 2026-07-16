const pool = require('../config/database');

class Category {
  static async getAll(type = null) {
    let query = 'SELECT * FROM categories WHERE is_active = TRUE';
    const params = [];
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY slug ASC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getById(id) {
    const query = 'SELECT * FROM categories WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async getBySlug(slug) {
    const query = 'SELECT * FROM categories WHERE slug = ?';
    const [rows] = await pool.query(query, [slug]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async getWithArticleCount(type = null) {
    let query = `
      SELECT c.*, COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id AND a.is_published = TRUE
      WHERE c.is_active = TRUE
    `;
    
    const params = [];
    
    if (type) {
      query += ' AND c.type = ?';
      params.push(type);
    }
    
    query += ' GROUP BY c.id ORDER BY c.slug ASC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async create(data) {
    const query = `
      INSERT INTO categories (slug, type, is_active)
      VALUES (?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      data.slug,
      data.type,
      data.is_active !== false
    ]);
    
    return result.insertId;
  }

  static async update(id, data) {
    let query = 'UPDATE categories SET ';
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
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  }
}

module.exports = Category;
