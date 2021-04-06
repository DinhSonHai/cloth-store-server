const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../../config/default.json');
const { validationResult } = require('express-validator');

const Product = require('../models/Product');

class ProductController {
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
}

module.exports = new ProductController();