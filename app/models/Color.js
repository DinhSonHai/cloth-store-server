const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ColorSchema = new Schema({
  color: { type: String, require: true }
})

module.exports = mongoose.model('color', ColorSchema);
