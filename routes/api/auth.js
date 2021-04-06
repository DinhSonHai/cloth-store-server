const express = require('express');
const router = express.Router();

const AuthController = require('../../app/controllers/AuthController');

const { validateSignUp, validatelogIn, validateLogIn } = require('../../helpers/valid');

// @route   POST api/auth/signup
// @desc    Sign up customer account
// @access  Public
router.post('/signup', validateSignUp, AuthController.signUp);

// @route   POST api/auth/login
// @desc    Log in customer account
// @access  Public
router.post('/login', validateLogIn, AuthController.logIn);

module.exports = router;