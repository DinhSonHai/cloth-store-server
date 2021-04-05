const { check } = require('express-validator');

// Validate signup data
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