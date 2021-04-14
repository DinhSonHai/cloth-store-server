const { check, body } = require('express-validator');

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
  check('name')
    .notEmpty()
    .withMessage('Please enter a valid name'),
  check('categories.*')
    .notEmpty()
    .withMessage('Please choose product category'),
  check('brand')
    .notEmpty()
    .withMessage('Please choose product brand'),
  check('price')
    .isNumeric()
    .withMessage('Please enter a valid price'),
  body('variants').exists().withMessage('Please enter cloth variants'),
  body('variants.*.sizeId').exists().withMessage('Please enter size'),
  body('variants.*.colorId').exists().withMessage('Please enter color'),
  body('variants.*.quantity').exists().isNumeric().withMessage('Please enter quantity'),
  check('description').notEmpty().withMessage('Please enter a description')
]

// Validate review product
module.exports.validateReview = [
  check('starRatings')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Star rating must between 0 and 5')
]

// Validate add item to cart
module.exports.validateAddItemToCart = [
  check('productId')
    .notEmpty()
    .withMessage('Please choose product'),
  check('sizeId')
    .notEmpty()
    .withMessage('Please choose size'),
  check('colorId')
    .notEmpty()
    .withMessage('Please choose color'),
  check('quantity')
    .notEmpty()
    .withMessage('Please choose quantity')
    .isInt()
    .withMessage('Quantity is not valid'),
]

// Validate remove item from cart
module.exports.validateRemoveItemFromCart = [
  check('productId')
    .notEmpty()
    .withMessage('Please choose product'),
  check('sizeId')
    .notEmpty()
    .withMessage('Please choose size'),
  check('colorId')
    .notEmpty()
    .withMessage('Please choose color')
]