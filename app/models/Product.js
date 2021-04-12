const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  photos: [{ type: String, trim: true }],
  name: { type: String, require: true, trim: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'category', require: true }],
  brand: { type: Schema.Types.ObjectId, ref: 'brand', require: true },
  price: { type: Number, required: true },
  variants: [{
    sizeId: { type: Schema.Types.ObjectId, ref: 'size', require: true },
    colorId: { type: String, require: true },
    quantity: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
  }],
  description: { type: String, trim: true, default: '' },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('product', ProductSchema);