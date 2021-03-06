
const { validationResult } = require('express-validator');
const dayjs = require('dayjs');
const ObjectId = require('mongoose').Types.ObjectId;
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

class ReviewController {

  // @route   GET api/reviews/:productId/review
  // @desc    Get All Product Review
  // @access  Public
  async getAllProductReviews(req, res) {
    try {
      const reviews = await Review.find({
        productId: req.params.productId
      }).populate('userId');

      if (!reviews) {
        return res.status(404).json({ errors: [{ msg: 'No reviews found' }] });
      }

      return res.json(reviews);
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   POST api/reviews/:productId/review
  // @desc    Review On A Product
  // @access  Private
  async review(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, comment, starRatings } = req.body;

    try {
      let product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'Users not exists' });
      }

      const isPurchased = user.purchasedProducts.some(productId => productId.toString() === product._id.toString());

      if (!isPurchased) {
        return res.status(404).json({ message: 'You havent buy this product yet!' });
      }

      const isReviewed = await Review.findOne({
        userId: new ObjectId(user._id),
        productId: new ObjectId(product._id)
      });

      if (isReviewed) {
        return res.status(404).json({ message: 'You have already reviewed this product!' });
      }

      let review = new Review({
        userId: user._id,
        productId: product._id,
        title,
        comment,
        starRatings
      });

      review = await review.save();

      const reviews = await Review.find({ productId: product._id });

      product.reviews.push(review._id);
      product.reviewsCount = product.reviewsCount + 1;
      product.totalStars = reviews.reduce((total, currentValue) => total + currentValue.starRatings, 0);
      product.starRatings = Math.ceil(product.totalStars / product.reviewsCount);

      await product.save();

      return res.json({ message: 'Review completed' });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   GET api/reviews/:productId/review/:reviewId
  // @desc    Get a single product review
  // @access  Private
  async getReviewById(req, res) {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const review = await Review.findById(req.params.reviewId).populate('userId');
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      if (review.productId.toString() !== product._id.toString()) {
        return res.status(404).json({ message: 'Review not found' });
      }

      return res.json(review);
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   PUT api/reviews/:productId/review/:reviewId
  // @desc    Edit A Product REVIEW
  // @access  Private
  async editReview(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { title, comment, starRatings } = req.body;

    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not exists' });
      }

      let review = await Review.findById(req.params.reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      if (review.userId.toString() !== req.user._id) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      review.title = title || "";

      review.comment = comment || "";

      review.starRatings = starRatings;

      review.commentedAt = dayjs().toISOString();

      await review.save();

      const reviews = await Review.find({ productId: product._id });

      product.totalStars = reviews.reduce((total, currentValue) => total + currentValue.starRatings, 0);
      product.starRatings = Math.round(product.totalStars / product.reviewsCount);

      await product.save();

      return res.json({ msg: 'Edit review completed' });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   DELETE api/reviews/:productId/review
  // @desc    Delete A Product REVIEW
  // @access  Private
  async deleteReview(req, res) {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const review = await Review.findById(req.params.reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      if (review.userId.toString() !== req.user._id) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      await review.remove();

      const reviews = await Review.find({ productId: product._id });

      product.reviews = product.reviews.filter(item => item.toString() !== review._id.toString());
      product.reviewsCount = product.reviewsCount - 1;
      product.totalStars = reviews.reduce((total, currentValue) => total + currentValue.starRatings, 0);
      product.starRatings = Math.round(product.totalStars / product.reviewsCount);

      await product.save();

      return res.json({ message: 'Review deleted' });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }
}

module.exports = new ReviewController();