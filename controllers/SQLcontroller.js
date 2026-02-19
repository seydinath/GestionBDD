const mysql = require('mysql2/promise');

/**
 * SQL Controller using mysql2 for MySQL database
 * Handles CRUD operations for products table using parameterized queries
 */

// Database configuration - should be moved to a config file in production
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gestion_bdd',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Helper function to get database connection
 */
const getConnection = async () => {
    try {
        return await pool.getConnection();
    } catch (error) {
        throw new Error('Database connection failed: ' + error.message);
    }
};

// CREATE - POST /products
exports.createProduct = async (req, res) => {
    let connection;
    
    try {
        const { name, price, category, inStock } = req.body;
        
        // Validate required fields
        if (!name || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Name and price are required fields'
            });
        }
        
        connection = await getConnection();
        
        // Parameterized query to prevent SQL injection
        const query = `
            INSERT INTO products (name, price, category, inStock)
            VALUES (?, ?, ?, ?)
        `;
        
        const [result] = await connection.execute(query, [
            name,
            price,
            category || null,
            inStock !== undefined ? inStock : true
        ]);
        
        // Fetch the created product
        const [rows] = await connection.execute(
            'SELECT * FROM products WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

// READ ALL - GET /products
exports.getAllProducts = async (req, res) => {
    let connection;
    
    try {
        const { category, inStock } = req.query;
        
        connection = await getConnection();
        
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];
        
        // Add optional filters
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        
        if (inStock !== undefined) {
            query += ' AND inStock = ?';
            params.push(inStock === 'true' ? 1 : 0);
        }
        
        query += ' ORDER BY createdAt DESC';
        
        const [rows] = await connection.execute(query, params);
        
        // Convert TINYINT (0/1) to boolean for inStock field
        const products = rows.map(product => ({
            ...product,
            inStock: Boolean(product.inStock)
        }));
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving products',
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

// READ ONE - GET /products/:id
exports.getProductById = async (req, res) => {
    let connection;
    
    try {
        const { id } = req.params;
        
        // Validate ID is a number
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }
        
        connection = await getConnection();
        
        const query = 'SELECT * FROM products WHERE id = ?';
        const [rows] = await connection.execute(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Convert TINYINT to boolean
        const product = {
            ...rows[0],
            inStock: Boolean(rows[0].inStock)
        };
        
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving product',
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

// UPDATE - PUT /products/:id
exports.updateProduct = async (req, res) => {
    let connection;
    
    try {
        const { id } = req.params;
        const { name, price, category, inStock } = req.body;
        
        // Validate ID is a number
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }
        
        connection = await getConnection();
        
        // Check if product exists
        const [existing] = await connection.execute(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Build update query dynamically based on provided fields
        const updates = [];
        const params = [];
        
        if (name !== undefined) {
            updates.push('name = ?');
            params.push(name);
        }
        
        if (price !== undefined) {
            updates.push('price = ?');
            params.push(price);
        }
        
        if (category !== undefined) {
            updates.push('category = ?');
            params.push(category);
        }
        
        if (inStock !== undefined) {
            updates.push('inStock = ?');
            params.push(inStock ? 1 : 0);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        
        // Add id to params
        params.push(id);
        
        const query = `
            UPDATE products 
            SET ${updates.join(', ')}
            WHERE id = ?
        `;
        
        await connection.execute(query, params);
        
        // Fetch updated product
        const [rows] = await connection.execute(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );
        
        const product = {
            ...rows[0],
            inStock: Boolean(rows[0].inStock)
        };
        
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

// DELETE - DELETE /products/:id
exports.deleteProduct = async (req, res) => {
    let connection;
    
    try {
        const { id } = req.params;
        
        // Validate ID is a number
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }
        
        connection = await getConnection();
        
        // Fetch product before deletion
        const [rows] = await connection.execute(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        const product = {
            ...rows[0],
            inStock: Boolean(rows[0].inStock)
        };
        
        // Delete product
        const query = 'DELETE FROM products WHERE id = ?';
        await connection.execute(query, [id]);
        
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

// Export the pool for use in other modules if needed
exports.pool = pool;
