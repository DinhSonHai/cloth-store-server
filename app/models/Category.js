const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  categoryName: { type: String, require: true, trim: true },
  // typeId: { type: Schema.Types.ObjectId, ref: 'type', require: true }
})

module.exports = mongoose.Schema('category', CategorySchema);