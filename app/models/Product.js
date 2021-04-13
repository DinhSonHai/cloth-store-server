const dayjs = require('dayjs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  photos: [{ type: String, trim: true, default: [] }],
  name: { type: String, require: true, trim: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'category', require: true }],
  brand: { type: Schema.Types.ObjectId, ref: 'brand', require: true },
  price: { type: Number, required: true },
  variants: [{
    sizeId: { type: Schema.Types.ObjectId, ref: 'size', require: true },
    color: { type: Schema.Types.ObjectId, ref: 'color', require: true },
    quantity: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
  }],
  description: { type: String, trim: true, require: true },
  isActive: { type: Boolean, default: true },
  starRatings: { type: Number, default: 0, min: 0, max: 5 },
  starsCount: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: dayjs().toISOString() }
});

module.exports = mongoose.model('product', ProductSchema);
