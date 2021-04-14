
const Color = require('../models/Color');

class ColorController {

  // @route   GET api/colors
  // @desc    Get All Colors
  // @access  Public
  async getAllColors(req, res) {
    try {
      const colors = await Color.find({});
      if (!colors) {
        return res.status(404).json({ errors: [{ msg: 'No colors found' }] });
      }
      return res.json(colors);
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

}

module.exports = new ColorController();