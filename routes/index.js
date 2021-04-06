const auth = require('./api/auth');
const products = require('./api/products');

function route(app) {
  // Auth routes
  app.use('/api/auth', auth);

  // Product routes
  app.use('/api/products', products);
}

module.exports = route;