
const ObjectId = require('mongoose').Types.ObjectId;
const Collection = require('../models/Collection');
const Type = require('../models/Type');

class CollectionController {
  // @route   GET api/collections/
  // @desc    Get all collections
  // @access  Public
  async getAllCollections(req, res) {
    try {
      const collections = await Collection.find({}).populate('types')
      if (!collections) {
        return res.status(404).json({ message: 'No collection found' });
      }
      return res.json(collections);
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }
}

module.exports = new CollectionController();
