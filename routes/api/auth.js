const express = require('express');
const router = express.Router();

const AuthController = require('../../app/controllers/AuthController');
const auth = require('../../app/middlewares/auth');
const checkPermission = require('../../app/middlewares/checkPermission');

const { validateSignUp, validatelogIn, validateLogIn } = require('../../helpers/valid');

// @route   POST api/auth/user
// @desc    Get user data
// @access  Private
router.get('/', auth, AuthController.getUser);

// @route   POST api/auth/login
// @desc    Log in customer account
// @access  Public
router.post('/login', validateLogIn, AuthController.logIn);

// @route   POST api/auth/signup
// @desc    Sign up customer account
// @access  Public
router.post('/signup', validateSignUp, AuthController.signUp);

// @route   POST api/auth/login
// @desc    Log in admin account
// @access  Public
router.post('/admin/login', validateLogIn, AuthController.logInAsAdmin);

module.exports = router;
