const express = require('express');
const router = express.Router();

const AuthController = require('../../app/controllers/AuthController');
const auth = require('../../app/middlewares/auth');
const checkPermission = require('../../app/middlewares/checkPermission');

const { validateSignUp, validateLogIn, validateChangeInfo, validateChangePassWord, validateForgotPassWord, validateResetPassWord } = require('../../helpers/valid');

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/', auth, AuthController.getUser);

// @route   PUT api/auth/info
// @desc    Change user info
// @access  Private
router.put('/info', [auth, validateChangeInfo], AuthController.changeInfo);

// @route   PUT api/auth/forgotpassword
// @desc    Send mail to user to reset password
// @access  Public
router.put('/forgotpassword', validateForgotPassWord, AuthController.forgotPassword);

// @route   PUT api/auth/resetpassword
// @desc    Reset user's password
// @access  Public
router.put('/resetpassword', validateResetPassWord, AuthController.resetPassword);

// @route   PUT api/auth/password
// @desc    Change user password
// @access  Private
router.put('/password', [auth, validateChangePassWord], AuthController.changePassword);

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
