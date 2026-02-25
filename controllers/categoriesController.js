const db = require('../db');

// Get all categories
const getCategories = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Server error retrieving categories' });
    }
};

// Create a new category
const createCategory = async (req, res) => {
    const { parent_id, name, slug } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO categories (parent_id, name, slug) VALUES (?, ?, ?)',
            [parent_id || null, name, slug]
        );
        res.status(201).json({ id: result.insertId, parent_id, name, slug, message: 'Category created successfully' });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Server error creating category' });
    }
};

module.exports = {
    getCategories,
    createCategory
};
