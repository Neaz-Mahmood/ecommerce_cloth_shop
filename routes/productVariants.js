const express = require('express');
const router = express.Router();
const productVariantsController = require('../controllers/productVariantsController');

router.get('/', productVariantsController.getProductVariants);
router.get('/:id', productVariantsController.getProductVariantById);
router.post('/', productVariantsController.createProductVariant);

module.exports = router;
