const express = require('express');
const router = express.Router();

const ColorController = require('../../app/controllers/ColorController');

// @route   GET api/colors
// @desc    Get All Colors
// @access  Public
router.get('/', ColorController.getAllColors);

module.exports = router;
