const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', require: true },
  productId: { type: Schema.Types.ObjectId, ref: 'product', require: true },
  sizeId: { type: Schema.Types.ObjectId, ref: 'size', require: true },
  colorId: { type: Schema.Types.ObjectId, ref: 'color', require: true },
  quantity: { type: Number, require: true }
})

module.exports = mongoose.model('cart', CartSchema);
