const express = require('express');
const router = express.Router();

const OrderController = require('../../app/controllers/OrderController');
const auth = require('../../app/middlewares/auth');
const checkPermission = require('../../app/middlewares/checkPermission');

const { validateOrder } = require('../../helpers/valid');

// @route   POST api/orders/
// @desc    Order
// @access  Private
router.post('/', [auth, validateOrder], OrderController.order);

module.exports = router;
