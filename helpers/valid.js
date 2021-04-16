const { check, body } = require('express-validator');
const _ = require('lodash');

// Validate sign up data
module.exports.validateSignUp = [
  check('name')
    .notEmpty()
    .withMessage('Please enter a valid name'),
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  check('password')
    .isLength({
      min: 6
    })
    .withMessage('Your password must be more than 6 characters')
]

// Validate log in data
module.exports.validateLogIn = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  check('password')
    .isLength({
      min: 6
    })
    .withMessage('Your password must be more than 6 characters')
]

// Validate add cloth data
module.exports.validateAddCloth = [
  body('photos')
    .custom((item)=>_.isArray(item) && item.length > 0)
    .withMessage('Please choose product photos'),
  check('name')
    .notEmpty()
    .withMessage('Please enter a valid name'),
  body('categories')
    .custom((item)=>_.isArray(item) && item.length > 0)
    .withMessage('Please choose product category'),
  check('brandId')
    .notEmpty()
    .withMessage('Please choose product brand'),
  check('price')
    .isNumeric()
    .withMessage('Please enter a valid price'),
  body('sizes')
    .custom((item)=>_.isArray(item) && item.length > 0)
    .withMessage('Please choose product sizes'),
  body('colors')
    .custom((item)=>_.isArray(item) && item.length > 0)
    .withMessage('Please choose product colors'),
  check('quantity')
    .notEmpty()
    .withMessage('Please enter product quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity invalid'),
  check('description')
    .notEmpty()
    .withMessage('Please enter product description'),
]

// Validate add category data
module.exports.validateAddCategory = [
  check('categoryName')
    .notEmpty()
    .withMessage('Please enter a valid category'),
  body('typeId')
    .notEmpty()
    .withMessage('Please choose product type'),
]

// Validate review product
module.exports.validateReview = [
  check('starRatings')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Star rating must between 0 and 5')
]

// Validate order
module.exports.validateOrder = [
  body('detail')
    .custom((item)=>_.isArray(item) && item.length > 0)
    .withMessage('Invalid Field'),
  body('detail.*.name')
    .notEmpty()
    .withMessage('Invalid name'),
  body('detail.*.productId')
    .notEmpty()
    .withMessage('Invalid Field'),
  body('detail.*.sizeId')
    .notEmpty()
    .withMessage('Invalid Field'),
  body('detail.*.colorId')
    .notEmpty()
    .withMessage('Invalid Field'),
  body('detail.*.quantity')
    .isInt({ min: 0 })
    .withMessage('Invalid quantity'),
]

