const db = require('../db');

// =========== ROLES ===========

const getRoles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM roles');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Server error retrieving roles' });
    }
};

const getRoleById = async (req, res) => {
    try {
        const [roles] = await db.query('SELECT * FROM roles WHERE id = ?', [req.params.id]);
        if (roles.length === 0) return res.status(404).json({ error: 'Role not found' });

        const [permissions] = await db.query(
            `SELECT p.id, p.name, p.description
             FROM permissions p
             JOIN role_permissions rp ON p.id = rp.permission_id
             WHERE rp.role_id = ?`,
            [req.params.id]
        );

        res.json({ ...roles[0], permissions });
    } catch (error) {
        console.error('Error fetching role by id:', error);
        res.status(500).json({ error: 'Server error retrieving role' });
    }
};

const createRole = async (req, res) => {
    const { name, description } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO roles (name, description) VALUES (?, ?)',
            [name, description || null]
        );
        res.status(201).json({ id: result.insertId, name, description, message: 'Role created successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'A role with this name already exists' });
        }
        console.error('Error creating role:', error);
        res.status(500).json({ error: 'Server error creating role' });
    }
};

const updateRole = async (req, res) => {
    const { name, description } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM roles WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Role not found' });

        await db.query(
            'UPDATE roles SET name = ?, description = ? WHERE id = ?',
            [name, description || null, req.params.id]
        );
        res.json({ id: Number(req.params.id), name, description, message: 'Role updated successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'A role with this name already exists' });
        }
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Server error updating role' });
    }
};

const deleteRole = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM roles WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Role not found' });
        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ error: 'Server error deleting role' });
    }
};

// =========== ROLE-PERMISSION JUNCTION ===========

const assignPermissionToRole = async (req, res) => {
    const { role_id, permission_id } = req.body;
    try {
        await db.query(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
            [role_id, permission_id]
        );
        res.status(201).json({ role_id, permission_id, message: 'Permission assigned to role successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'This permission is already assigned to the role' });
        }
        console.error('Error assigning permission to role:', error);
        res.status(500).json({ error: 'Server error assigning permission to role' });
    }
};

const removePermissionFromRole = async (req, res) => {
    const { role_id, permission_id } = req.body;
    try {
        const [result] = await db.query(
            'DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?',
            [role_id, permission_id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Role-permission assignment not found' });
        res.json({ role_id, permission_id, message: 'Permission removed from role successfully' });
    } catch (error) {
        console.error('Error removing permission from role:', error);
        res.status(500).json({ error: 'Server error removing permission from role' });
    }
};

// =========== USER-ROLE JUNCTION ===========

const assignRoleToUser = async (req, res) => {
    const { user_id, role_id } = req.body;
    try {
        await db.query(
            'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
            [user_id, role_id]
        );
        res.status(201).json({ user_id, role_id, message: 'Role assigned to user successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'This role is already assigned to the user' });
        }
        console.error('Error assigning role to user:', error);
        res.status(500).json({ error: 'Server error assigning role to user' });
    }
};

const removeRoleFromUser = async (req, res) => {
    const { user_id, role_id } = req.body;
    try {
        const [result] = await db.query(
            'DELETE FROM user_roles WHERE user_id = ? AND role_id = ?',
            [user_id, role_id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User-role assignment not found' });
        res.json({ user_id, role_id, message: 'Role removed from user successfully' });
    } catch (error) {
        console.error('Error removing role from user:', error);
        res.status(500).json({ error: 'Server error removing role from user' });
    }
};

const getUserRoles = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id FROM users WHERE id = ?', [req.params.userId]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });

        const [rows] = await db.query(
            `SELECT r.id, r.name, r.description
             FROM roles r
             JOIN user_roles ur ON r.id = ur.role_id
             WHERE ur.user_id = ?`,
            [req.params.userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching user roles:', error);
        res.status(500).json({ error: 'Server error retrieving user roles' });
    }
};

module.exports = {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    assignPermissionToRole,
    removePermissionFromRole,
    assignRoleToUser,
    removeRoleFromUser,
    getUserRoles
};
