const express = require('express');
const router = express.Router();

const ProductController = require('../../app/controllers/ProductController');
const auth = require('../../app/middlewares/auth');
const checkPermission = require('../../app/middlewares/checkPermission');

const { validateAddCloth } = require('../../helpers/valid');

// @route   GET api/products/
// @desc    Get All Clothes
// @access  Public
router.get('/', ProductController.getAll);

// @route   GET api/products/:productId
// @desc    Get Cloth by Id
// @access  Public
router.get('/:productId', ProductController.getById);

// @route   POST api/products/
// @desc    Add Clothes
// @access  Private Admin
router.post('/', validateAddCloth, auth, checkPermission, ProductController.add);

module.exports = router;
