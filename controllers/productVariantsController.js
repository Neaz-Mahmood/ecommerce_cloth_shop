const db = require('../db');

// Get all product variants
const getProductVariants = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM product_variants');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching variants:', error);
        res.status(500).json({ error: 'Server error retrieving variants' });
    }
};

// Get variant by ID
const getProductVariantById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM product_variants WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Variant not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching variant by id:', error);
        res.status(500).json({ error: 'Server error retrieving variant' });
    }
};

// Create new product variant
const createProductVariant = async (req, res) => {
    const { product_id, sku, price, stock_quantity } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO product_variants (product_id, sku, price, stock_quantity) VALUES (?, ?, ?, ?)',
            [product_id, sku, price, stock_quantity || 0]
        );
        res.status(201).json({ id: result.insertId, product_id, sku, message: 'Variant created successfully' });
    } catch (error) {
        console.error('Error creating variant:', error);
        res.status(500).json({ error: 'Server error creating variant' });
    }
};

module.exports = {
    getProductVariants,
    getProductVariantById,
    createProductVariant
};
