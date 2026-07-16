const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const query = `
      INSERT INTO users (username, email, password, full_name, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      data.username,
      data.email,
      hashedPassword,
      data.full_name || '',
      data.role || 'user'
    ]);
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await pool.query(query, [username]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async update(id, data) {
    let query = 'UPDATE users SET ';
    const params = [];
    const fields = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && key !== 'password') {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      fields.push('password = ?');
      params.push(hashedPassword);
    }

    query += fields.join(', ') + ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);
  }

  static async delete(id) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  }

  static async getAll(limit = 10, offset = 0) {
    const query = `
      SELECT id, username, email, full_name, role, is_active, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.query(query, [limit, offset]);
    return rows;
  }

  static async getCount() {
    const query = 'SELECT COUNT(*) as total FROM users';
    const [rows] = await pool.query(query);
    return rows[0].total;
  }
}

module.exports = User;
