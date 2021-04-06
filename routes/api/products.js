const express = require('express');
const router = express.Router();

const ProductController = require('../../app/controllers/ProductController');

// @route   GET api/products/
// @desc    Get All Clothes
// @access  Public
router.get('/', ProductController.getAll);

module.exports = router;