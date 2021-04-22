const express = require('express');
const router = express.Router();

const AuthController = require('../../app/controllers/AuthController');
const auth = require('../../app/middlewares/auth');
const checkPermission = require('../../app/middlewares/checkPermission');

const { validateSignUp, validatelogIn, validateLogIn, validateChangeInfo } = require('../../helpers/valid');

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/', auth, AuthController.getUser);

// @route   PUT api/auth/info
// @desc    Change user info
// @access  Private
router.put('/info', [auth, validateChangeInfo], AuthController.changeInfo);

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
