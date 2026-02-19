const express = require('express');
const router = express.Router();
const sqlController = require('../controllers/SQLcontroller');

/**
 * SQL Routes using MySQL
 */

// POST /api/sql/products - Create a new product
router.post('/', sqlController.createProduct);

// GET /api/sql/products - Get all products (with optional query filters)
router.get('/', sqlController.getAllProducts);

// GET /api/sql/products/:id - Get a single product by ID
router.get('/:id', sqlController.getProductById);

// PUT /api/sql/products/:id - Update a product by ID
router.put('/:id', sqlController.updateProduct);

// DELETE /api/sql/products/:id - Delete a product by ID
router.delete('/:id', sqlController.deleteProduct);

module.exports = router;
