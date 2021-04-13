const express = require('express');
const router = express.Router();

const ReviewController = require('../../app/controllers/ReviewController');
const auth = require('../../app/middlewares/auth');
const checkPermission = require('../../app/middlewares/checkPermission');

const { validateReview } = require('../../helpers/valid');

// @route   GET api/reviews/:productId/review
// @desc    Get All Product Review
// @access  Public
router.get('/:productId/review', ReviewController.getAllProductReviews);

// @route   POST api/reviews/:productId/review
// @desc    Review On A Product
// @access  Private
router.post('/:productId/review', [auth, validateReview], ReviewController.review);

module.exports = router;
