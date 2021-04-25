const dayjs = require('dayjs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  photos: [{ type: String, trim: true, require: true }],
  name: { type: String, require: true, trim: true, text: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'category', require: true }],
  brandId: { type: Schema.Types.ObjectId, ref: 'brand', require: true },
  price: { type: Number, require: true },
  sizes: [{ type: Schema.Types.ObjectId, ref: 'size', require: true }],
  colors: [{ type: Schema.Types.ObjectId, ref: 'color', require: true }],
  quantity: { type: Number, require: true },
  description: { type: String, trim: true, require: true },
  isActive: { type: Boolean, default: true },
  reviews: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'review'
      }
    ],
    default: []
  },
  starRatings: { type: Number, default: 0, min: 0, max: 5 },
  totalStars: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  createdAt: { type: Date, default: dayjs().toISOString() }
});

module.exports = mongoose.model('product', ProductSchema);
