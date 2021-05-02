const express = require('express');
const router = express.Router();

const CategoryController = require('../../app/controllers/CategoryController');
const auth = require('../../app/middlewares/auth');
const checkPermission = require('../../app/middlewares/checkPermission');

const { validateAddCategory } = require('../../app/middlewares/valid');

// @route   GET api/categories/
// @desc    Get All Categories
// @access  Public
router.get('/', CategoryController.getAll);

// @route   GET api/categories/types/:typeId
// @desc    Get All Categories by type
// @access  Public
router.get('/types/:typeId', CategoryController.getAllCategoriesByType);

// @route   GET api/categories/:categoryId
// @desc    Get Category by Id
// @access  Public
router.get('/:categoryId', CategoryController.getById);

// @route   POST api/categories/
// @desc    Add Categories
// @access  Private Admin
router.post('/', [auth, checkPermission, validateAddCategory], CategoryController.addCategory);

// @route   PUT api/categories/:categoryId
// @desc    Edit Categories by categoryId
// @access  Private Admin
router.put('/:categoryId', [auth, checkPermission, validateAddCategory], CategoryController.editCategory);

// @route   DELETE api/categories/:categoryId
// @desc    Remove Categories by categoryId
// @access  Private Admin
router.delete('/:categoryId', [auth, checkPermission], CategoryController.removeCategory);

module.exports = router;
