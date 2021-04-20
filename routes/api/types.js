const express = require('express');
const router = express.Router();

const TypeController = require('../../app/controllers/TypeController');

// @route   GET api/types/
// @desc    Get All Types
// @access  Public
router.get('/', TypeController.getAllTypes);

// @route   GET api/types/:typeId
// @desc    Get type by Id
// @access  Public
router.get('/:typeId', TypeController.getTypeById);

module.exports = router;
