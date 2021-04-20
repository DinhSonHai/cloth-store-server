
const Type = require('../models/Type');

class TypeController {
  // @route   GET api/types/
  // @desc    Get All Types
  // @access  Public
  async getAllTypes(req, res) {
    try {
      const types = await Type.find({});
      if (!types) {
        return res.status(400).json({ errors: [{ msg: 'No type found' }] });
      }
      return res.json(types);
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   GET api/types/:typeId
  // @desc    Get type by Id
  // @access  Public
  async getTypeById(req, res) {
    try {
      const type = await Type.findById(req.params.typeId).populate("collectionId");
      if (!type) {
        return res.status(400).json({ errors: [{ msg: 'No type found' }] });
      }
      return res.json(type);
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }
}

module.exports = new TypeController();

