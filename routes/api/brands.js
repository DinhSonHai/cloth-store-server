const express = require('express');
const router = express.Router();

const BrandController = require('../../app/controllers/BrandController');

// @route   GET api/brands
// @desc    Get All Brands
// @access  Public
router.get('/', BrandController.getAllBrands);

module.exports = router;
