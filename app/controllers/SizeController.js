
const Size = require('../models/Size');

class SizeController {

  // @route   GET api/sizes
  // @desc    Get All Sizes
  // @access  Public
  async getAllSizes(req, res) {
    try {
      const sizes = await Size.find({});
      if (!sizes) {
        return res.status(404).json({ errors: [{ msg: 'No sizes found' }] });
      }
      return res.json(sizes);
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

}

module.exports = new SizeController();