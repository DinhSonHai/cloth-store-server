const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  photos: [{ type: String, trim: true }],
  name: { type: String, require: true, trim: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'category' }],
  brand: { type: String, require: true, trim: true },
  price: { type: Number, required: true },
  variants: [{
    size: { type: String, require: true, trim: true },
    quantity: { type: Number, required: true }
  }],
  description: { type: String, trim: true, default: '' },
});

module.exports = mongoose.model('product', ProductSchema);