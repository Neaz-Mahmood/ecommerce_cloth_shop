const express = require('express');
const router = express.Router();
const attributesController = require('../controllers/attributesController');

// Attribute Definitions ("Size", "Color")
router.get('/', attributesController.getAttributes);
router.post('/', attributesController.createAttribute);

// Attribute Options ("Small", "Red")
router.get('/values', attributesController.getAttributeValues);
router.post('/values', attributesController.createAttributeValue);

// Link Variant to Option
router.post('/assign-to-variant', attributesController.assignAttributeToVariant);

module.exports = router;
