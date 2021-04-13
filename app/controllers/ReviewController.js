
const { validationResult } = require('express-validator');
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
      return res.json({ test:"test" });
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
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, comment, starRatings } = req.body;

    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ errors: [{ msg: 'Product not found' }] });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'User not exist' }] });
      }

      const isPurchased = user.purchasedProducts.some(productId => productId.toString() === product._id.toString());

      if (!isPurchased) {
        return res.status(404).json({ errors: [{ msg: 'You havent buy this product yet!' }] });
      }

      const isReviewed = await Review.findOne({
        userId: new ObjectId(user._id),
        productId: new ObjectId(product._id)
      });

      if (isReviewed) {
        return res.status(404).json({ errors: [{ msg: 'You have already reviewed this product!' }] });
      }

      const review = new Review({
        userId: user._id,
        productId: product._id,
        title,
        comment,
        starRatings
      });

      await review.save();
      return res.json({ msg: 'Review completed'});
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }
}

module.exports = new ReviewController();