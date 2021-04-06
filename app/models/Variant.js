const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VariantSchema = new Schema({
  size: { type: String, trim: true },
  quantity: { type: Number, required: true }
});

module.exports = mongoose.model('variant', VariantSchema);