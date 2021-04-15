const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  brandName: { type: String, require: true, trim: true }
})

module.exports = mongoose.model('brand', BrandSchema);