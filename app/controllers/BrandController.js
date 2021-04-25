
const Brand = require('../models/Brand');

class BrandController {

  // @route   GET api/brands
  // @desc    Get All Brands
  // @access  Public
  async getAllBrands(req, res) {
    try {
      const brands = await Brand.find({});
      if (!brands) {
        return res.status(404).json({ errors: [{ msg: 'No brands found' }] });
      }
      return res.json(brands);
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

}

module.exports = new BrandController();