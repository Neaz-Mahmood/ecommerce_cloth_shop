const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

// Role-Permission junction (before /:id to avoid param capture)
router.post('/assign-permission', rolesController.assignPermissionToRole);
router.delete('/remove-permission', rolesController.removePermissionFromRole);

// User-Role junction (before /:id to avoid param capture)
router.post('/assign-to-user', rolesController.assignRoleToUser);
router.delete('/remove-from-user', rolesController.removeRoleFromUser);
router.get('/user/:userId', rolesController.getUserRoles);

// Role CRUD
router.get('/', rolesController.getRoles);
router.get('/:id', rolesController.getRoleById);
router.post('/', rolesController.createRole);
router.put('/:id', rolesController.updateRole);
router.delete('/:id', rolesController.deleteRole);

module.exports = router;
