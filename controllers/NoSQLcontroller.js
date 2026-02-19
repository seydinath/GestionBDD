const Product = require('../models/Product');

/**
 * NoSQL Controller using Mongoose for MongoDB
 * Handles CRUD operations for Product model
 */

// CREATE - POST /products
exports.createProduct = async (req, res) => {
    try {
        const { name, price, category, inStock } = req.body;
        
        // Create new product
        const product = new Product({
            name,
            price,
            category,
            inStock
        });
        
        // Save to database
        await product.save();
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// READ ALL - GET /products
exports.getAllProducts = async (req, res) => {
    try {
        // Optional query parameters for filtering
        const { category, inStock } = req.query;
        const filter = {};
        
        if (category) filter.category = category;
        if (inStock !== undefined) filter.inStock = inStock === 'true';
        
        const products = await Product.find(filter).sort({ createdAt: -1 });
        
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
    }
};

// READ ONE - GET /products/:id
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        // Handle invalid MongoDB ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error retrieving product',
            error: error.message
        });
    }
};

// UPDATE - PUT /products/:id
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, inStock } = req.body;
        
        // Find and update product
        const product = await Product.findByIdAndUpdate(
            id,
            { name, price, category, inStock },
            { 
                new: true, // Return updated document
                runValidators: true // Run schema validators
            }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        
        // Handle invalid MongoDB ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// DELETE - DELETE /products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: product
        });
    } catch (error) {
        // Handle invalid MongoDB ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};
