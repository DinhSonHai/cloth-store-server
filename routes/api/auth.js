const express = require('express');
const router = express.Router();

const AuthController = require('../../app/controllers/AuthController');
const auth = require('../../app/middlewares/auth');
const checkPermission = require('../../app/middlewares/checkPermission');

const { validateSignUp, validateLogIn, validateChangeInfo, validateChangePassWord, validateForgotPassWord, validateResetPassWord } = require('../../app/middlewares/valid');

// @route   GET api/auth
// @desc    Get user data
// @access  Private
router.get('/', auth, AuthController.getUser);

// @route   GET api/auth/admin
// @desc    Get admin data
// @access  Private
router.get('/admin', auth, AuthController.getAdmin);

// @route   PUT api/auth/info
// @desc    Change user info
// @access  Private
router.put('/info', [auth, validateChangeInfo], AuthController.changeInfo);

// @route   PUT api/auth/admin/info
// @desc    Change admin info
// @access  Private Admin
router.put('/admin/info', [auth, checkPermission, validateChangeInfo], AuthController.changeAdminInfo);

// @route   PUT api/auth/forgotpassword
// @desc    Send mail to user to reset password
// @access  Public
router.put('/forgotpassword', validateForgotPassWord, AuthController.forgotPassword);

// @route   GET api/auth/resetpassword
// @desc    Check if token is invalid or expired
// @access  Public
router.get('/resetpassword', AuthController.checkToken);

// @route   PUT api/auth/resetpassword
// @desc    Reset user's password
// @access  Public
router.put('/resetpassword', validateResetPassWord, AuthController.resetPassword);

// @route   PUT api/auth/password
// @desc    Change user password
// @access  Private
router.put('/password', [auth, validateChangePassWord], AuthController.changePassword);

// @route   PUT api/auth/admin/password
// @desc    Change admin password
// @access  Private Admin
router.put('/admin/password', [auth, checkPermission, validateChangePassWord], AuthController.changeAdminPassword);

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
