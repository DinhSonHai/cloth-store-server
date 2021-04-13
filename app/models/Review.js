const dayjs = require('dayjs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', require: true },
  productId: { type: Schema.Types.ObjectId, ref: 'product', require: true },
  title: { type: String },
  comment: { type: String },
  starRatings: { type: Number, require: true },
  commentedAt: { type: Date, default: dayjs().toISOString() }
});

module.exports = mongoose.model('review', ReviewSchema);
