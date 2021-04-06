const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(400).json({
      errors: [{ message: 'You have to login to perform this action!' }],
    });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.logInSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    // 401: Unauthorized
    return res.status(401).json({
      errors: [{ msg: 'Token is invalid!' }],
    });
  }
}