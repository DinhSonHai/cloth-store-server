const mongoose = require('mongoose');
const dayjs = require('dayjs');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  images: [{ type: String, trim: true }],
  name: { type: String, require: true, trim: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'category', require: true },
  brand: { type: String, require: true, trim: true },
  price: { type: Number, required: true },
  sizes: [{ type: String, trim: true }],
  colors: [{ type: String, trim: true }],
  description: { type: String, trim: true, default: '' },
  sQuantity: { type: Number, required: true },
  mQuantity: { type: Number, required: true },
  lQuantity: { type: Number, required: true },
  createdAt: { type: Date, default: dayjs().toISOString() },
  modifiedAt: { type: Date },
});

module.exports = mongoose.model('product', ProductSchema);