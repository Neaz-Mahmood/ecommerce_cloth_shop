const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

// Route configurations
router.get('/', categoriesController.getCategories);
router.post('/', categoriesController.createCategory);

module.exports = router;
