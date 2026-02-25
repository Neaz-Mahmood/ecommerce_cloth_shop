const db = require('../db');

// =========== ATTRIBUTES ===========

const getAttributes = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM attributes');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching attributes:', error);
        res.status(500).json({ error: 'Server error retrieving attributes' });
    }
};

const createAttribute = async (req, res) => {
    const { name } = req.body;
    try {
        const [result] = await db.query('INSERT INTO attributes (name) VALUES (?)', [name]);
        res.status(201).json({ id: result.insertId, name, message: 'Attribute created successfully' });
    } catch (error) {
        console.error('Error creating attribute:', error);
        res.status(500).json({ error: 'Server error creating attribute' });
    }
};

// =========== ATTRIBUTE VALUES ===========

const getAttributeValues = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM attribute_values');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching attribute values:', error);
        res.status(500).json({ error: 'Server error retrieving attribute values' });
    }
};

const createAttributeValue = async (req, res) => {
    const { attribute_id, value } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO attribute_values (attribute_id, value) VALUES (?, ?)',
            [attribute_id, value]
        );
        res.status(201).json({ id: result.insertId, attribute_id, value, message: 'Attribute value created successfully' });
    } catch (error) {
        console.error('Error creating attribute value:', error);
        res.status(500).json({ error: 'Server error creating attribute value' });
    }
};

// =========== VARIANT ATTRIBUTE VALUES (Junction) ===========

const assignAttributeToVariant = async (req, res) => {
    const { variant_id, attribute_value_id } = req.body;
    try {
        await db.query(
            'INSERT INTO variant_attribute_values (variant_id, attribute_value_id) VALUES (?, ?)',
            [variant_id, attribute_value_id]
        );
        res.status(201).json({ variant_id, attribute_value_id, message: 'Attribute assigned to variant successfully' });
    } catch (error) {
        console.error('Error assigning attribute to variant:', error);
        res.status(500).json({ error: 'Server error assigning attribute to variant' });
    }
};


module.exports = {
    getAttributes,
    createAttribute,
    getAttributeValues,
    createAttributeValue,
    assignAttributeToVariant
};
