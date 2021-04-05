const express = require('express');
const router = express.Router();

const AuthController = require('../../app/controllers/AuthController');

const { validateSignUp } = require('../../helpers/valid');

// @route   POST api/auth/signup
// @desc    Sign up customer account
// @access  Public
router.post('/signup', validateSignUp, AuthController.signUp);

module.exports = router;