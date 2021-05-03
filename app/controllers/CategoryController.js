const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../../config/default.json');
const { validationResult } = require('express-validator');
const _ = require('lodash');

const Category = require('../models/Category');

class CategoryController {
  // @route   GET api/categories/
  // @desc    Get All Categories
  // @access  Public
  async getAll(req, res) {
    try {
      const categories = await Category.find({});
      if (!categories) {
        return res.status(404).json({ errors: [{ msg: 'No categories found' }] });
      }
      return res.json(categories);
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   GET api/categories/types/:typeId
  // @desc    Get All Categories by type
  // @access  Public
  async getAllCategoriesByType(req, res) {
    try {
      const categories = await Category.find({ typeId: req.params.typeId });
      if (!categories) {
        return res.status(404).json({ errors: [{ msg: 'No categories found' }] });
      }
      return res.json(categories);
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   GET api/categories/:categoryId
  // @desc    Get Category by Id
  // @access  Public
  async getById(req, res) {
    try {
      const category = await Category.findById(req.params.categoryId);
      if (!category) {
        return res.status(404).json({ errors: [{ msg: 'No category found' }] });
      }
      return res.json(category);
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   POST api/categories/
  // @desc    Add Categories
  // @access  Private Admin
  async addCategory(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    const { categoryName, typeId } = req.body;

    const category = new Category({
      categoryName, typeId
    });

    try {
      await category.save();
      return res.json({ msg: 'Add category success' });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   PUT api/categories/:categoryId
  // @desc    Edit Categories by categoryId
  // @access  Private Admin
  async editCategory(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    const { categoryName, typeId } = req.body;

    try {
      let category = await Category.findById(req.params.categoryId);
      if (!category) {
        return res.status(400).json({ errors: [{ msg: 'No category found' }] });
      }

      category = _.extend(category, { categoryName, typeId });

      await category.save();
      return res.json({ msg: 'Edit category success' });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   DELETE api/categories/:categoryId
  // @desc    Remove Categories by categoryId
  // @access  Private Admin
  async removeCategory(req, res) {
    try {
      const category = await Category.findById(req.params.categoryId);
      if (!category) {
        return res.status(404).json({ errors: [{ msg: 'Category not found' }] });
      }
      await category.remove();
      return res.json({ msg: 'Category removed!' })
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }
}

module.exports = new CategoryController();
