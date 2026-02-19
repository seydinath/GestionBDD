const express = require('express');
const router = express.Router();
const noSQLController = require('../controllers/NoSQLcontroller');

/**
 * NoSQL Routes using MongoDB/Mongoose
 */

// POST /api/nosql/products - Create a new product
router.post('/', noSQLController.createProduct);

// GET /api/nosql/products - Get all products (with optional query filters)
router.get('/', noSQLController.getAllProducts);

// GET /api/nosql/products/:id - Get a single product by ID
router.get('/:id', noSQLController.getProductById);

// PUT /api/nosql/products/:id - Update a product by ID
router.put('/:id', noSQLController.updateProduct);

// DELETE /api/nosql/products/:id - Delete a product by ID
router.delete('/:id', noSQLController.deleteProduct);

module.exports = router;
