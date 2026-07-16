-- Create Database
CREATE DATABASE IF NOT EXISTS abu_bakr_oil_site;
USE abu_bakr_oil_site;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(150),
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Languages Table
CREATE TABLE IF NOT EXISTS languages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  native_name VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  type ENUM('transformer', 'aircraft') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content LONGTEXT NOT NULL,
  featured_image VARCHAR(255),
  author_id INT,
  views_count INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  language_code VARCHAR(10) DEFAULT 'ar',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (author_id) REFERENCES users(id),
  INDEX idx_category (category_id),
  INDEX idx_language (language_code),
  INDEX idx_published (is_published)
);

-- Article Translations Table
CREATE TABLE IF NOT EXISTS article_translations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  article_id INT NOT NULL,
  language_code VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_article_lang (article_id, language_code)
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  article_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_article (article_id),
  INDEX idx_approved (is_approved)
);

-- Tags Table
CREATE TABLE IF NOT EXISTS tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  language_code VARCHAR(10) DEFAULT 'ar',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Article Tags Table
CREATE TABLE IF NOT EXISTS article_tags (
  article_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (article_id, tag_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Search History Table
CREATE TABLE IF NOT EXISTS search_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  search_query VARCHAR(255) NOT NULL,
  results_count INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  article_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_article (user_id, article_id)
);

-- Insert Languages
INSERT INTO languages (code, name, native_name, is_active) VALUES
('ar', 'Arabic', 'العربية', TRUE),
('en', 'English', 'English', TRUE),
('fr', 'French', 'Français', TRUE),
('de', 'German', 'Deutsch', TRUE),
('es', 'Spanish', 'Español', TRUE),
('it', 'Italian', 'Italiano', TRUE),
('pt', 'Portuguese', 'Português', TRUE),
('ja', 'Japanese', '日本語', TRUE),
('zh', 'Chinese', '中文', TRUE),
('ru', 'Russian', 'Русский', TRUE);

-- Insert Categories for Transformers
INSERT INTO categories (slug, type, is_active) VALUES
('power-transformers', 'transformer', TRUE),
('distribution-transformers', 'transformer', TRUE),
('special-transformers', 'transformer', TRUE),
('dry-transformers', 'transformer', TRUE),
('instrument-transformers', 'transformer', TRUE),
('autotransformers', 'transformer', TRUE),
('rectifier-transformers', 'transformer', TRUE),
('furnace-transformers', 'transformer', TRUE),
('phase-shift-transformers', 'transformer', TRUE),
('test-transformers', 'transformer', TRUE);

-- Insert Categories for Aircraft
INSERT INTO categories (slug, type, is_active) VALUES
('commercial-aircraft', 'aircraft', TRUE),
('military-aircraft', 'aircraft', TRUE),
('private-aircraft', 'aircraft', TRUE),
('helicopters', 'aircraft', TRUE),
('cargo-aircraft', 'aircraft', TRUE),
('regional-aircraft', 'aircraft', TRUE),
('turboprop-aircraft', 'aircraft', TRUE),
('business-jets', 'aircraft', TRUE),
('seaplanes', 'aircraft', TRUE),
('drones-uav', 'aircraft', TRUE);
