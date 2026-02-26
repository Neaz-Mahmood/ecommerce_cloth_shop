const express = require('express');
const router = express.Router();

const categoryRoutes = require('./categories');
const productRoutes = require('./products');
const productVariantRoutes = require('./productVariants');
const attributeRoutes = require('./attributes');
const userRoutes = require('./users');
const roleRoutes = require('./roles');
const permissionRoutes = require('./permissions');

// Mount individual entity routes
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/product-variants', productVariantRoutes);
router.use('/attributes', attributeRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);

// General health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'API is up and running' });
});

module.exports = router;
