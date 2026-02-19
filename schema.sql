-- SQL Schema for Products Table
-- This table stores product information with fields equivalent to the MongoDB model

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    inStock BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index for faster queries on category
CREATE INDEX idx_category ON products(category);

-- Index for inStock status
CREATE INDEX idx_inStock ON products(inStock);
