const dayjs = require('dayjs');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid')

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', require: true  },
  orderId: { type: String, require: true },
  orderedDate: { type: Date, default: dayjs().toISOString()},
  detail: [
    {
      name: { type: String, require: true },
      productId: { type: Schema.Types.ObjectId, ref: 'product', require: true  },
      sizeId: { type: Schema.Types.ObjectId, ref: 'size', require: true  },
      colorId: { type: Schema.Types.ObjectId, ref: 'color', require: true  },
      quantity: { type: Number, require: true }
    }
  ],
  total: { type: Number, require: true },
  // status 0: cancle, 1: complete, 2: pending 
  status: { type: Number, default: 2 }
});

module.exports = mongoose.model('order', OrderSchema);
