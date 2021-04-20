const express = require('express');
const router = express.Router();

const CollectionController = require('../../app/controllers/CollectionController');

// @route   GET api/collections/
// @desc    Get all collections
// @access  Public
router.get('/', CollectionController.getAllCollections);

module.exports = router;
