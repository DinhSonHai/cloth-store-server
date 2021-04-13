

const { isValidObjectId } = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;
const Cart = require("../models/Cart");

class CartController {
  
  // @route   GET api/carts
  // @desc    Add item to cart
  // @access  Private
  async getCart(req, res) {
    try {
      const carts = await Cart.find({
        userId: req.user._id
      });

      if (!carts) {
        return res.status(400).json({ errors: [{ msg: 'Your cart is empty' }] });
      }
      return res.json(carts)
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   PUT api/carts
  // @desc    Add item to cart
  // @access  Private
  async addCart(req, res) {
    try {
      const carts = await Cart.find({
        userId: new ObjectId(req.user._id)
      });
      
      return res.json(carts)
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }
}

module.exports = new CartController();