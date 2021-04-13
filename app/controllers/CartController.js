

const { validationResult } = require('express-validator');
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
      return res.json(carts);
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   PUT cartsapi/carts
  // @desc    Add item to cart
  // @access  Private
  async addCart(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, sizeId, colorId, quantity } = req.body;

    try {
      const carts = await Cart.find({
        userId: req.user._id
      });

      if (!carts) {
        return res.status(400).json({ errors: [{ msg: 'Your cart is empty' }] });
      }

      let cartItem = carts.find((cart) => cart.productId.toString() === productId && cart.sizeId.toString() === sizeId && cart.colorId.toString() === colorId);
      if (cartItem) {
        cartItem.quantity = cartItem.quantity + quantity;
        await Cart.findOneAndUpdate(
          { _id: cartItem._id },
          { $set: { quantity: cartItem.quantity } },
          { new: true }
        );
      }
      else {
        cartItem = new Cart({
          userId: req.user._id,
          productId, 
          sizeId, 
          colorId, 
          quantity
        });
        await cartItem.save();
      }

      return res.json({ msg: 'Add item to cart successfully' });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }
}

module.exports = new CartController();
