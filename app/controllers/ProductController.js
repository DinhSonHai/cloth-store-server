const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../../config/default.json');
const { validationResult } = require('express-validator');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

const Product = require('../models/Product');
const Type = require('../models/Type');
const Category = require('../models/Category');
const Brand = require('../models/Brand');

class ProductController {
  // @route   GET api/products/
  // @desc    Get All Clothes
  // @access  Public
  async getAllProducts(req, res) {
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

  // @route   GET api/products/admin
  // @desc    Get All Products for admin page with filter and pagination
  // @access  Public
  async getAllProductsForAdmin(req, res) {
    const { q, sort } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const start = (page - 1) * limit;
    const end = page * limit;

    let sortValue = { 'createdAt': 'desc' };
    if (sort === 'profit') {
      sortValue = { 'profit': 'desc' };
    }

    let query = {};
    if (q) {
      query = { $text: { $search: q } };
    }

    try {
      const products = await Product.find(query).populate('categories').sort(sortValue);

      if (!products) {
        return res.status(400).json({ errors: [{ msg: 'No product found' }] });
      }

      return res.json({
        products: products.slice(start, end),
        total: products.length
      });
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   GET api/products/search
  // @desc    Search Products
  // @access  Public
  async searchProducts(req, res) {
    const { q, categoryId, sort, size, color, brand, available } = req.query;
    const from = parseInt(req.query.from);
    const to = parseInt(req.query.to);

    let filter = { sizes: size, colors: color, brandId: brand };
    if (from >= 0 && to >= 0) {
      filter = { ...filter, price: { $gte: from, $lt: to } };
    }
    if (available === 'outofstock') {
      filter = { ...filter, isActive: false };
    }

    for (let key in filter) {
      if (key !== 'isActive') {
        if (!filter[key]) {
          delete filter[key];
        }
      }
    }

    console.log(filter);

    const page = parseInt(req.query.page) || 1;

    const limit = 10;
    const start = (page - 1) * limit;
    const end = page * limit;

    let sortValue = { 'price': 'asc' };
    if (sort === 'name') {
      sortValue = { 'name': 'asc' };
    }
    else if (sort === 'asc') {
      sortValue = { 'price': 'asc' };
    }
    else if (sort === 'desc') {
      sortValue = { 'price': 'desc' };
    }

    let query = { $text: { $search: q }, ...filter };

    try {
      console.log(query);
      let products = await Product.find(query).populate('categories').sort(sortValue);
      if (!products) {
        return res.status(400).json({ errors: [{ msg: 'No product found' }] });
      }

      // Get all categories from products
      let categories = products.map(product => product.categories);

      // Flatten array inside array
      categories = [].concat.apply([], categories);

      // Remove duplicate category
      categories = categories.reduce((acc, current) => {
        const category = acc.find(item => item._id === current._id);
        if (!category) {
          return acc.concat([current]);
        }
        else {
          return acc;
        }
      }, []);

      if (categoryId) {
        products = products.filter(product => product.categories.find(category => category._id.toString() === categoryId));
      }

      return res.json({
        products: products.slice(start, end),
        total: products.length,
        categories
      });

    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   GET api/products/types/:typeId
  // @desc    Get All Products By typeId
  // @access  Public
  async getProductsByType(req, res) {
    const { categoryId, sort, size, color, brand, available } = req.query;
    const from = parseInt(req.query.from);
    const to = parseInt(req.query.to);

    let filter = { sizes: size, colors: color, brandId: brand };
    if (from >= 0 && to >= 0) {
      filter = { ...filter, price: { $gte: from, $lt: to } };
    }
    if (available === 'outofstock') {
      filter = { ...filter, isActive: false };
    }

    for (let key in filter) {
      if (key !== 'isActive') {
        if (!filter[key]) {
          delete filter[key];
        }
      }
    }

    const page = parseInt(req.query.page) || 1;

    const limit = 10;
    const start = (page - 1) * limit;
    const end = page * limit;

    // Sort filter
    let sortValue = { 'price': 'asc' };
    if (sort === 'name') {
      sortValue = { 'name': 'asc' };
    }
    else if (sort === 'asc') {
      sortValue = { 'price': 'asc' };
    }
    else if (sort === 'desc') {
      sortValue = { 'price': 'desc' };
    }

    let query = { ...filter };

    try {
      if (categoryId) {
        // Get products by categoryId
        query = { ...filter, 'categories': categoryId };
      }
      else {
        // Get products by typeId  
        const categories = await Category.find({ typeId: req.params.typeId });
        if (!categories) {
          return res.status(400).json({ message: 'No category found' });
        }

        const categoryList = categories.map(category => category._id);

        query = { ...filter, 'categories': { $in: categoryList } };
      }

      console.log(query);

      const products = await Product.find(query).sort(sortValue);
      if (!products) {
        return res.status(400).json({ errors: [{ msg: 'No product found' }] });
      }

      return res.json({
        products: products.slice(start, end),
        total: products.length
      });
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   GET api/products/brands/:productId
  // @desc    Get Products by brand
  // @access  Public
  async getProductsByBrand(req, res) {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }

      const products = await Product.find({ brandId: product.brandId, _id: { $ne: product._id } }).limit(4);
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
  async getProductsInCart(req, res) {
    const { productIdList } = req.body;
    try {
      const products = await Product.find({ '_id': { $in: productIdList } }).populate('sizes colors');

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
      const product = await Product.findById(req.params.productId).populate('sizes colors brandId categories').populate({ path: 'reviews', populate: { path: 'userId' } });
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
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { photos, name, categories, brandId, price, sizes, colors, quantity, description } = req.body;

    const product = new Product({
      photos, name, categories, brandId, price, sizes, colors, quantity, description
    });

    try {
      await product.save();
      return res.json({ message: 'Add cloth success' });
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
      return res.json({ message: 'Edit cloth success' });
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
