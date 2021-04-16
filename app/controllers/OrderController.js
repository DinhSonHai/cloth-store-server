const { validationResult } = require('express-validator');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;
const { customAlphabet } = require('nanoid');

const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderController {

  // @route   POST api/orders/
  // @desc    Order
  // @access  Private
  async order(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { detail } = req.body;

    try {
      const code = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 2);
      const number = customAlphabet('0123456789', 5);
      const codeStr = code();
      const numberStr = number();
      const orderId = codeStr + numberStr;

      const productIdList = detail.map(item => item.productId);

      const products = await Product.find({ '_id': { $in: productIdList } });
      if (!products) {
        return res.status(400).json({ errors: [{ msg: 'Not found' }] });
      }

      const totalMoney = detail.reduce((total, item) => {
        const price = products.find(productItem => productItem._id.toString() === item.productId)?.price;
        if (price) {
          total = total + item.quantity*price;
        }
        return total;
      }, 0);

      const order = new Order({
        userId: req.user._id,
        orderId,
        detail,
        total: totalMoney
      });

      await order.save();

      return res.json({ msg: 'Order success' });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }
}

module.exports = new OrderController();