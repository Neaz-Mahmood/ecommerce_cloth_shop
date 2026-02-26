const express = require('express');
const router = express.Router();
const permissionsController = require('../controllers/permissionsController');

router.get('/', permissionsController.getPermissions);
router.get('/:id', permissionsController.getPermissionById);
router.post('/', permissionsController.createPermission);
router.put('/:id', permissionsController.updatePermission);
router.delete('/:id', permissionsController.deletePermission);

module.exports = router;
