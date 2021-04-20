const { validationResult } = require('express-validator');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;
const nodemailer = require('nodemailer');
const { customAlphabet } = require('nanoid');
const config = require('../../config/default.json');

const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

class OrderController {
  // @route   GET api/orders/
  // @desc    Get all users's orders
  // @access  Private
  async getAllUsersOrders(req, res) {
    try {
      const orders = await Order.find({ userId: req.user._id }).populate({ path: "detail", populate: { path: "sizeId colorId" } });
      if (!orders) {
        return res.status(400).json({ message: 'No order found' });
      }
      return res.json(orders);
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   POST api/orders/
  // @desc    Order
  // @access  Private
  async order(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
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
        return res.status(400).json({ message: 'No product found' });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const totalMoney = detail.reduce((total, item) => {
        const price = products.find(productItem => productItem._id.toString() === item.productId).price;
        if (price) {
          total = total + item.quantity * price;
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

      // Send order success email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.email,
          pass: config.passWord
        }
      })

      // Set up confirm order email for user
      const content = `
        <h1>Thanks for shopping on aware</h1>
        <h2>Visit aware page: <a href="http://localhost:3000">Aware</a></h2>
      `;

      const mailOptions = {
        from: config.email,
        to: user.email,
        subject: 'Order success at aware',
        html: content,
      };

      // Set up confirm order email for admin
      const contentAdmin = `
        <h1>New order is placed</h1>
        <h2>Visit admin aware page for more detail: <a href="http://localhost:3000/admin">Aware</a></h2>
      `;

      const mailOptionsAdmin = {
        from: config.email,
        to: "17110290@student.hcmute.edu.vn",
        subject: 'New order is placed',
        html: contentAdmin,
      };

      transporter
        .sendMail(mailOptions)
        .then(() => {
          return transporter.sendMail(mailOptionsAdmin);
        })
        .then(() => {
          return res.json({
            message: 'Order success',
          });
        })
        .catch((err) => {
          return res.status(400).json({
            message: err.message
          });
        });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   PUT api/orders/:orderId
  // @desc    Cancle order
  // @access  Private
  async cancelOrder(req, res) {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      if (order.status === config.PENDING_ORDER) {
        order.status = config.CANCELED_ORDER;
        await order.save();
        return res.json({ message: 'Cancel order success' });
      }

      return res.json({ message: 'Can not perform this action' });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   POST api/orders/admin
  // @desc    Get All Orders
  // @access  Private Admin
  async getAllOrders(req, res) {
    try {
      const orders = await Order.find({});
      if (!orders) {
        return res.status(404).json({ message: 'No orders found' });
      }
      return res.json(orders)
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   PUT api/orders/admin/:orderId/complete
  // @desc    Mark order as completed
  // @access  Private Admin
  async completeOrder(req, res) {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.status === config.PENDING_ORDER) {
        order.status = config.COMPLETED_ORDER;

        await order.save();

        return res.json({ message: 'Order marked as completed' });
      }
      return res.json({ message: 'Can not perform this action' });

    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   PUT api/orders/admin/:orderId/cancle
  // @desc    Mark order as cancled
  // @access  Private Admin
  async cancelOrderByAdmin(req, res) {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.status === config.PENDING_ORDER) {
        order.status = config.CANCELED_ORDER;
        await order.save();
        return res.json({ message: 'Order marked as canceled' });
      }

      return res.json({ message: 'Can not perform this action' });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }
}


module.exports = new OrderController();