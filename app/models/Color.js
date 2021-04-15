const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ColorSchema = new Schema({
  colorName: { type: String, require: true }
})

module.exports = mongoose.model('color', ColorSchema);
