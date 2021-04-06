const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../../config/default.json');
const { validationResult } = require('express-validator');

const Product = require('../models/Product');

class ProductController {
  // @route   GET api/products/
  // @desc    Get All Clothes
  // @access  Public
  async getAll(req, res) {
    try {
      const products = await Product.find({});
      if (!products) {
        return res.status(400).json({ errors: [{ message: 'No product found' }]});
      }
      return res.json({ products });
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   POST api/products/
  // @desc    Add Clothes
  // @access  Private Admin
  async add(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, categories, brand, price, variants, description } = req.body;

    const product = new Product({
      name, categories, brand, price, variants, description
    });

    try {
      await product.save(); 
      return res.json({ message: 'Add cloth success' });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }
}

module.exports = new ProductController();