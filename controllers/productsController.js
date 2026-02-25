const db = require('../db');

// Get all products
const getProducts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Server error retrieving products' });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching product by id:', error);
        res.status(500).json({ error: 'Server error retrieving product' });
    }
};

// Create new product
const createProduct = async (req, res) => {
    const { category_id, name, description, base_price, material, is_active } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO products (category_id, name, description, base_price, material, is_active) VALUES (?, ?, ?, ?, ?, ?)',
            [category_id || null, name, description, base_price, material, is_active !== undefined ? is_active : true]
        );
        res.status(201).json({ id: result.insertId, name, message: 'Product created successfully' });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Server error creating product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct
};
