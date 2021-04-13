const express = require('express');
const router = express.Router();

const ReviewController = require('../../app/controllers/ReviewController');
const auth = require('../../app/middlewares/auth');
const checkPermission = require('../../app/middlewares/checkPermission');

// @route   GET api/reviews/:productId/review
// @desc    Get All Product Review
// @access  Public
router.get('/:productId/review', ReviewController.getAllProductReviews);

module.exports = router;
