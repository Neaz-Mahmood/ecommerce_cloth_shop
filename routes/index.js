const express = require('express');
const router = express.Router();

const categoryRoutes = require('./categories');
const productRoutes = require('./products');

// Mount individual entity routes
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

// General health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'API is up and running' });
});

module.exports = router;
