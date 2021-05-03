const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');

module.exports = function (req, res, next) {
  const { role } = req.user;
  if (role !== config.ADMIN_ROLE) {
    return res.status(403).json({
      msg: 'Permission deny'
    });
  }
  next();
};
