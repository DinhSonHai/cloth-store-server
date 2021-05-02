const express = require('express');
const router = express.Router();

const OrderController = require('../../app/controllers/OrderController');
const auth = require('../../app/middlewares/auth');
const checkPermission = require('../../app/middlewares/checkPermission');

const { validateOrder } = require('../../app/middlewares/valid');

// @route   GET api/orders/
// @desc    Get all users's orders
// @access  Private
router.get('/', auth, OrderController.getAllUsersOrders);

// @route   POST api/orders/
// @desc    Order
// @access  Private
router.post('/', [auth, validateOrder], OrderController.order);

// @route   POST api/orders/admin
// @desc    Get All Orders for admin with search, filter and pagination
// @access  Private Admin
router.get('/admin', [auth, checkPermission], OrderController.getAllOrders);

// @route   PUT api/orders/admin/:orderId/complete
// @desc    Mark order as completed
// @access  Private Admin
router.put('/admin/:orderId/complete', [auth, checkPermission], OrderController.completeOrder);

// @route   PUT api/orders/admin/:orderId/cancle
// @desc    Mark order as cancled
// @access  Private Admin
router.put('/admin/:orderId/cancel', [auth, checkPermission], OrderController.cancelOrderByAdmin);

// @route   PUT api/orders/:orderId
// @desc    Cancle order
// @access  Private
router.put('/:orderId', auth, OrderController.cancelOrder);

module.exports = router;
