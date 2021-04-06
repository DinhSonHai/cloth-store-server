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
  body('variants').exists().withMessage('Please enter size and quantity'),
  body('variants.*.size').exists().withMessage('Please enter size and quantity'),
  body('variants.*.quantity').exists().isNumeric().withMessage('Please enter size and quantity'),
  check('description').notEmpty().withMessage('Please enter a description')
]