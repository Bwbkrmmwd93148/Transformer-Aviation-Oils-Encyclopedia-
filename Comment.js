const pool = require('../config/database');

class Comment {
  static async create(data) {
    const query = `
      INSERT INTO comments (article_id, user_id, content, rating)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      data.article_id,
      data.user_id,
      data.content,
      data.rating || null
    ]);
    
    return result.insertId;
  }

  static async getByArticle(article_id, approved_only = true) {
    let query = `
      SELECT c.*, u.full_name, u.email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.article_id = ?
    `;
    
    const params = [article_id];
    
    if (approved_only) {
      query += ' AND c.is_approved = TRUE';
    }
    
    query += ' ORDER BY c.created_at DESC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getById(id) {
    const query = `
      SELECT c.*, u.full_name, u.email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    
    const [rows] = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async approve(id) {
    await pool.query('UPDATE comments SET is_approved = TRUE WHERE id = ?', [id]);
  }

  static async reject(id) {
    await pool.query('DELETE FROM comments WHERE id = ?', [id]);
  }

  static async delete(id) {
    await pool.query('DELETE FROM comments WHERE id = ?', [id]);
  }

  static async getPending() {
    const query = `
      SELECT c.*, u.full_name, a.title as article_title
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN articles a ON c.article_id = a.id
      WHERE c.is_approved = FALSE
      ORDER BY c.created_at DESC
    `;
    
    const [rows] = await pool.query(query);
    return rows;
  }

  static async getCount(article_id = null, approved_only = true) {
    let query = 'SELECT COUNT(*) as total FROM comments WHERE 1=1';
    const params = [];
    
    if (article_id) {
      query += ' AND article_id = ?';
      params.push(article_id);
    }
    
    if (approved_only) {
      query += ' AND is_approved = TRUE';
    }
    
    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  static async getAverageRating(article_id) {
    const query = `
      SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings
      FROM comments
      WHERE article_id = ? AND rating IS NOT NULL AND is_approved = TRUE
    `;
    
    const [rows] = await pool.query(query, [article_id]);
    return rows[0];
  }
}

module.exports = Comment;
