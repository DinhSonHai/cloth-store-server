const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../../config/default.json');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const Admin = require('../models/Admin');

class AuthController {

  // @route   POST api/auth/user
  // @desc    Get user data
  // @access  Private
  async getUser(req, res) {
    try {
      const user = await User.findById(req.user._id).select(['-password', '-resetPasswordLink']);
      if (!user) {
        return res.status(404).json({
          errors: [{ msg: 'User not exist' }],
        });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).send('Server Error');
    }
  }

  // @route   POST api/auth/login
  // @desc    Log in customer account
  // @access  Public
  async logIn(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get data from body
    const { email, password } = req.body;

    try {
      // Check if user with this email exist
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: 'Your e-mail/password is invalid' }]
        })
      }

      // Check if password match
      const isMatch = await user.checkPassWord(password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: 'Your e-mail/password is invalid' }]
        })
      }

      // Create token payload
      const payload = {
        user: {
          _id: user._id,
          role: user.role
        }
      };

      // Generate token
      const token = jwt.sign(payload, config.logInSecret, {
        expiresIn: '7d'
      });

      return res.json({ token });
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }

  // @route   POST api/auth/signup
  // @desc    Sign up customer account
  // @access  Public
  async signUp(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get data from body
    const { name, email, password } = req.body;

    try {
      // Check if email exist
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'This email has already signed up' }] });
      }

      user = new User({
        name,
        email,
        password
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save data
      await user.save();

      // Without send mail
      res.json({ msg: 'Thanks for register aware account' });

      // Send sign up success email
      // const transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     user: config.email,
      //     pass: config.passWord
      //   }
      // })

      // const content = `
      //   <h1>Thanks for register aware account</h1>
      //   <h2>Visit aware page: <a href="http://localhost:3000">Aware</a></h2>
      // `;

      // const mailOptions = {
      //   from: config.email,
      //   to: email,
      //   subject: 'Account register success',
      //   html: content,
      // };

      // transporter
      //   .sendMail(mailOptions)
      //   .then(() => {
      //     return res.json({
      //       msg: 'Thanks for register aware account',
      //     });
      //   })
      //   .catch((err) => {
      //     return res.status(400).json({
      //       errors: [{ msg: err.message }],
      //     });
      //   });
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }


  // @route   POST api/auth/login
  // @desc    Log in admin account
  // @access  Public
  async logInAsAdmin(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get data from body
    const { email, password } = req.body;

    try {
      // Check if admin exist
      let admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({
          errors: [{ msg: 'Your e-mail/password is invalid' }]
        })
      }

      // Check if password match
      const isMatch = await admin.checkPassWord(password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: 'Your e-mail/password is invalid' }]
        })
      }

      // Create token payload
      const payload = {
        user: {
          _id: admin._id,
          role: admin.role
        }
      };

      // Generate token
      const token = jwt.sign(payload, config.logInSecret, {
        expiresIn: '7d'
      });

      return res.json({ token });
    } catch (error) {
      return res.status(500).send('Server error');
    }
  }
}

module.exports = new AuthController();