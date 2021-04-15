const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../../config/default.json');
const { validationResult } = require('express-validator');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

const Product = require('../models/Product');

class ProductController {
  // @route   GET api/products/
  // @desc    Get All Clothes
  // @access  Public
  async getAll(req, res) {
    try {
      const products = await Product.find({});
      if (!products) {
        return res.status(400).json({ errors: [{ msg: 'No product found' }] });
      }
      return res.json(products);
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   POST api/products/carts
  // @desc    Get Product Info in Carts
  // @access  public
  async getAllProductsInCart(req, res) {
    const { productIdList } = req.body;
    try {
      const products = await Product.find({ '_id': { $in: productIdList } });

      if (!products) {
        return res.status(400).json({ errors: [{ msg: 'No product found' }] });
      }

      return res.json(products);
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   GET api/products/:productId
  // @desc    Get Cloth by Id
  // @access  Public
  async getById(req, res) {
    try {
      const product = await Product.findById(req.params.productId).populate('sizes colors');
      if (!product) {
        return res.status(400).json({ errors: [{ msg: 'No product found' }] });
      }
      return res.json(product);
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   POST api/products/
  // @desc    Add Clothes
  // @access  Private Admin
  async addCloth(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { photos, name, categories, brandId, price, sizes, colors, quantity, description } = req.body;

    const product = new Product({
      photos, name, categories, brandId, price, sizes, colors, quantity, description
    });

    try {
      await product.save();
      return res.json({ msg: 'Add cloth success' });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   PUT api/products/:productId
  // @desc    Edit clothes by productId
  // @access  Private Admin
  async editCloth(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { photos, name, categories, brandId, price, sizes, colors, quantity, description } = req.body;

    try {
      let product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(400).json({ errors: [{ msg: 'No product found' }] });
      }

      product = _.extend(product, { photos, name, categories, brandId, price, sizes, colors, quantity, description });

      await product.save();
      return res.json({ msg: 'Edit cloth success' });
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }

  // @route   DELETE api/products/:productId
  // @desc    Remove clothes by productId
  // @access  Private Admin
  async removeCloth(req, res) {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ errors: [{ msg: 'Product not found' }] });
      }
      await product.remove();
      return res.json({ msg: 'Cloth removed!' })
    } catch (error) {
      return res.status(500).send('Server error!');
    }
  }
}

module.exports = new ProductController();
