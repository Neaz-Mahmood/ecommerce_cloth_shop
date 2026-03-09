const db = require('../db');

const getPermissions = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM permissions');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Server error retrieving permissions' });
    }
};

const getPermissionById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM permissions WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Permission not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching permission by id:', error);
        res.status(500).json({ error: 'Server error retrieving permission' });
    }
};

const createPermission = async (req, res) => {
    const { name, description } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO permissions (name, description) VALUES (?, ?)',
            [name, description || null]
        );
        res.status(201).json({ id: result.insertId, name, description, message: 'Permission created successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'A permission with this name already exists' });
        }
        console.error('Error creating permission:', error);
        res.status(500).json({ error: 'Server error creating permission' });
    }
};

const updatePermission = async (req, res) => {
    const { name, description } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM permissions WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Permission not found' });

        await db.query(
            'UPDATE permissions SET name = ?, description = ? WHERE id = ?',
            [name, description || null, req.params.id]
        );
        res.json({ id: Number(req.params.id), name, description, message: 'Permission updated successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'A permission with this name already exists' });
        }
        console.error('Error updating permission:', error);
        res.status(500).json({ error: 'Server error updating permission' });
    }
};

const deletePermission = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM permissions WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Permission not found' });
        res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
        console.error('Error deleting permission:', error);
        res.status(500).json({ error: 'Server error deleting permission' });
    }
};

module.exports = {
    getPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission
};
