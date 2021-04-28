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
      const user = await User.findById(req.user._id).select(['-password', '-resetPasswordLink', '-role']);
      if (!user) {
        return res.status(404).json({
          message: 'User not exist'
        });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).send('Server Error');
    }
  }

  // @route   GET api/auth/admin
  // @desc    Get admin data
  // @access  Private
  async getAdmin(req, res) {
    try {
      const admin = await Admin.findById(req.user._id).select(['-password', '-resetPasswordLink', '-role']);
      if (!admin) {
        return res.status(404).json({
          message: 'Invalid action'
        });
      }
      return res.json(admin);
    } catch (error) {
      return res.status(500).send('Server Error');
    }
  }

  // @route   PUT api/auth/info
  // @desc    Change user info
  // @access  Private
  async changeInfo(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name } = req.body;

    try {
      let user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      user.name = name;

      await user.save();
      return res.json({ message: 'Update info success' });
    } catch (error) {
      return res.status(500).send('Server Error');
    }
  }

  // @route   PUT api/auth/admin/info
  // @desc    Change admin info
  // @access  Private Admin
  async changeAdminInfo(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name } = req.body;

    try {
      let admin = await Admin.findById(req.user._id);

      if (!admin) {
        return res.status(404).json({
          message: 'You can not perform this action'
        });
      }

      admin.name = name;

      await admin.save();
      return res.json({ message: 'Update info success' });
    } catch (error) {
      return res.status(500).send('Server Error');
    }
  }

  // @route   PUT api/auth/forgotpassword
  // @desc    Send mail to user to reset password
  // @access  Public
  async forgotPassword(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: 'User with this email not found'
        });
      }

      const payload = {
        user: {
          _id: user._id,
        },
      };

      const token = jwt.sign(payload, config.forgotPasswordSecret, {
        expiresIn: '1d'
      });

      await user.updateOne({
        resetPasswordLink: token,
      });

      // Send forgot password email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.email,
          pass: config.passWord
        }
      })

      const content = `
        <h1>You have requested reset your password at aware</h1>
        <h2>Reset your password at: <a href=${config.CLIENT_URL}/auth/resetpassword/${token}>Reset Password</a></h2>
        <h2>Visit aware page: <a href=${config.CLIENT_URL}>Aware</a></h2>
      `;

      const mailOptions = {
        from: config.email,
        to: email,
        subject: 'Reset aware account password',
        html: content,
      };

      transporter
        .sendMail(mailOptions)
        .then(() => {
          return res.json({
            message: 'Visit your email to reset your password, link expires in 1 day'
          })
        })
        .catch((err) => {
          return res.status(400).json({
            errors: [{ msg: err.message }]
          });
        });
    } catch (error) {
      return res.status(500).send('Server Error');
    }
  }

  // @route   PUT api/auth/resetpassword
  // @desc    Reset user's password
  // @access  Public
  async resetPassword(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { password, resetPasswordLink } = req.body;

    try {
      let userId = '';

      jwt.verify(resetPasswordLink, config.forgotPasswordSecret,
        (err, decoded) => {
          if (decoded) {
            userId = decoded.user._id;
          }
          if (err) {
            return res.status(401).json({ message: 'Link reset password is invalid or expired' });
          }
        });

      let user = await User.findById(userId);

      // Check if reset link is used
      if (!user.resetPasswordLink) {
        return res.status(400).json({ message: 'Reset link has been used' });
      }

      // Check if reset password link not match
      if (user.resetPasswordLink !== resetPasswordLink) {
        return res.status(400).json({ message: 'Invalid reset password link' });
      }

      // Encode password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user.password = hashedPassword;
      user.resetPasswordLink = '';

      await user.save();

      return res.json({ message: 'Your password has been resetted' });
    } catch (error) {
      return res.status(500).send('Server Error');
    }
  }

  // @route   PUT api/auth/password
  // @desc    Change user password
  // @access  Private
  async changePassword(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      let user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      // Check if password match
      const isMatch = await user.checkPassWord(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          message: 'Your password is invalid'
        })
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(newPassword, salt);

      user.password = password;

      await user.save();
      return res.json({ message: 'Update password success' });
    } catch (error) {
      return res.status(500).send('Server Error');
    }
  }

  // @route   PUT api/auth/admin/password
  // @desc    Change admin password
  // @access  Private Admin
  async changeAdminPassword(req, res) {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      let admin = await Admin.findById(req.user._id);

      if (!admin) {
        return res.status(404).json({
          message: 'You can not perform this action'
        });
      }

      // Check if password match
      const isMatch = await admin.checkPassWord(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          message: 'Your password is invalid'
        })
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(newPassword, salt);

      admin.password = password;

      await admin.save();
      return res.json({ message: 'Update password success' });
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
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    // Get data from body
    const { email, password } = req.body;

    try {
      // Check if user with this email exist
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: 'Your e-mail/password is invalid'
        })
      }

      // Check if password match
      const isMatch = await user.checkPassWord(password);
      if (!isMatch) {
        return res.status(400).json({
          message: 'Your e-mail/password is invalid'
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
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    // Get data from body
    let { name, email, password } = req.body;

    try {
      // Check if email exist
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'This email has already signed up' });
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      user = new User({
        name,
        email,
        password
      });

      // Save data
      await user.save();

      // Without send mail
      res.json({ message: 'Thanks for register aware account' });

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
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    // Get data from body
    const { email, password } = req.body;

    try {
      // Check if admin exist
      let admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({
          message: 'Your e-mail/password is invalid'
        })
      }

      // Check if password match
      const isMatch = await admin.checkPassWord(password);
      if (!isMatch) {
        return res.status(400).json({
          message: 'Your e-mail/password is invalid'
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