const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB Connection
const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion_bdd', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Connect to MongoDB
connectMongoDB();

// Import routes
const noSQLRoutes = require('./routes/noSQLRoutes');
const sqlRoutes = require('./routes/sqlRoutes');

// Routes
app.use('/api/nosql/products', noSQLRoutes);
app.use('/api/sql/products', sqlRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Product Management API',
        endpoints: {
            nosql: {
                base: '/api/nosql/products',
                methods: ['GET', 'POST', 'PUT', 'DELETE']
            },
            sql: {
                base: '/api/sql/products',
                methods: ['GET', 'POST', 'PUT', 'DELETE']
            }
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`NoSQL API: http://localhost:${PORT}/api/nosql/products`);
    console.log(`SQL API: http://localhost:${PORT}/api/sql/products`);
});

module.exports = app;
