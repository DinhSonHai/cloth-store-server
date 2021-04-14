const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SizeSchema = new Schema({
  sizeName: { type: String, require: true, trim: true }
});

module.exports = mongoose.model('size', SizeSchema);
