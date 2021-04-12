const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  brand: { type: String, require: true, trim: true }
})

module.exports = mongoose.Schema('brand', BrandSchema);