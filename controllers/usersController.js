const db = require('../db');

const getUsers = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, first_name, last_name, email, phone, is_active, created_at, updated_at FROM users'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Server error retrieving users' });
    }
};

const getUserById = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, first_name, last_name, email, phone, is_active, created_at, updated_at FROM users WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user by id:', error);
        res.status(500).json({ error: 'Server error retrieving user' });
    }
};

const createUser = async (req, res) => {
    const { first_name, last_name, email, password_hash, phone } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO users (first_name, last_name, email, password_hash, phone) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, password_hash, phone || null]
        );
        res.status(201).json({ id: result.insertId, first_name, last_name, email, message: 'User created successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'A user with this email already exists' });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error creating user' });
    }
};

const updateUser = async (req, res) => {
    const { first_name, last_name, email, phone, is_active } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'User not found' });

        const [result] = await db.query(
            'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, is_active = ? WHERE id = ?',
            [first_name, last_name, email, phone || null, is_active !== undefined ? is_active : true, req.params.id]
        );
        res.json({ id: Number(req.params.id), first_name, last_name, email, message: 'User updated successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'A user with this email already exists' });
        }
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error updating user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Server error deleting user' });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
