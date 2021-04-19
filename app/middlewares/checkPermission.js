const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const { role } = req.user;
  if (role !== 0) {
    return res.status(403).json({
      msg: 'Permission deny'
    });
  }
  next();
};
