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

// @route   POST api/orders/admin
// @desc    Get All Orders
// @access  Private Admin
router.get('/admin', [auth, checkPermission], OrderController.getAllOrders);

// @route   PUT api/orders/:orderId
// @desc    Cancle order
// @access  Private
router.put('/:orderId', auth, OrderController.cancleOrder);

module.exports = router;
