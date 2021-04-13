const express = require('express');
const router = express.Router();

const CartController = require('../../app/controllers/CartController');
const auth = require('../../app/middlewares/auth');
const { validateAddItemToCart, validateRemoveItemFromCart } = require('../../helpers/valid');

// @route   GET api/carts
// @desc    Add item to cart
// @access  Private
router.get('/', auth, CartController.getCart);

// @route   POST api/carts
// @desc    Add item to cart
// @access  Private
router.post('/', [auth, validateAddItemToCart], CartController.addItemToCart);

// @route   DELETE api/carts
// @desc    Remove item from cart
// @access  Private
router.delete('/', [auth, validateRemoveItemFromCart], CartController.removeItemFromCart);

module.exports = router;
