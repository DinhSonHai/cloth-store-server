const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
  collectionName: { type: String, require: true, trim: true },
});

module.exports = mongoose.model('collection', CollectionSchema);