const express = require('express');
const router = express.Router();

const SizeController = require('../../app/controllers/SizeController');

// @route   GET api/sizes
// @desc    Get All Sizes
// @access  Public
router.get('/', SizeController.getAllSizes);

module.exports = router;
