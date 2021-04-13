const express = require('express');
const router = express.Router();

const CartController = require('../../app/controllers/CartController');
const auth = require('../../app/middlewares/auth');

// @route   GET api/carts
// @desc    Add item to cart
// @access  Private
router.get('/', auth, CartController.getCart);

// @route   POST api/carts
// @desc    Add item to cart
// @access  Private
router.post('/', auth, CartController.addCart);

module.exports = router;
