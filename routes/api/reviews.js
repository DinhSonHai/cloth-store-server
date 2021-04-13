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

// @route   PUT api/reviews/:productId/review/:reviewId
// @desc    Edit A Product REVIEW
// @access  Private
router.put('/:productId/review/:reviewId', [auth, validateReview], ReviewController.editReview);

// @route   DELETE api/reviews/:productId/review/:reviewId
// @desc    Delete A Product REVIEW
// @access  Private
router.delete('/:productId/review/:reviewId', [auth], ReviewController.deleteReview);

module.exports = router;
