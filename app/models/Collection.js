const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
  collectionName: { type: String, require: true, trim: true },
  types: [{ type: Schema.Types.ObjectId, ref: 'type', require: true }]
});

module.exports = mongoose.model('collection', CollectionSchema);
