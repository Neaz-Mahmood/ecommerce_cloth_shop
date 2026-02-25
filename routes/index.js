const express = require('express');
const router = express.Router();

const categoryRoutes = require('./categories');
const productRoutes = require('./products');
const productVariantRoutes = require('./productVariants');
const attributeRoutes = require('./attributes');

// Mount individual entity routes
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/product-variants', productVariantRoutes);
router.use('/attributes', attributeRoutes);

// General health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'API is up and running' });
});

module.exports = router;
