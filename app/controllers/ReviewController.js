
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
}

module.exports = new ReviewController();