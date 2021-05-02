const express = require('express');
const router = express.Router();

const ProductController = require('../../app/controllers/ProductController');
const auth = require('../../app/middlewares/auth');
const checkPermission = require('../../app/middlewares/checkPermission');

const { validateAddCloth } = require('../../app/middlewares/valid');

// @route   GET api/products/
// @desc    Get All Products
// @access  Public
router.get('/', ProductController.getAllProducts);

// @route   GET api/products/admin
// @desc    Get All Products for admin page with search, filter and pagination
// @access  Public
router.get('/admin', [auth, checkPermission], ProductController.getAllProductsForAdmin);

// @route   GET api/products/search
// @desc    Search Products
// @access  Public
router.get('/search', ProductController.searchProducts);

// @route   GET api/products/brands/:productId
// @desc    Get Products by brand
// @access  Public
router.get('/brands/:productId', ProductController.getProductsByBrand);

// @route   GET api/products/types/:typeId
// @desc    Get Products by typeId
// @access  Public
router.get('/types/:typeId', ProductController.getProductsByType);

// @route   POST api/products/carts
// @desc    Get Product Info in Carts
// @access  public
router.post('/carts', ProductController.getProductsInCart);

// @route   GET api/products/:productId
// @desc    Get Cloth by Id
// @access  Public
router.get('/:productId', ProductController.getById);

// @route   POST api/products/
// @desc    Add Clothes
// @access  Private Admin
router.post('/', [auth, checkPermission, validateAddCloth], ProductController.addCloth);

// @route   PUT api/products/:productId
// @desc    Edit clothes by productId
// @access  Private Admin
router.put('/:productId', [auth, checkPermission, validateAddCloth], ProductController.editCloth);

// @route   DELETE api/products/:productId
// @desc    Remove clothes by productId
// @access  Private Admin
router.delete('/:productId', [auth, checkPermission], ProductController.removeCloth);

module.exports = router;
