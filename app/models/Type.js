const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TypeSchema = new Schema({
  typeName: { type: String, require: true, trim: true },
  collectionId: { type: Schema.Types.ObjectId, ref: 'collection', require: true }
});

module.exports = mongoose.Schema('type', TypeSchema);