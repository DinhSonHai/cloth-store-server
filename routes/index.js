const auth = require('./api/auth');
const products = require('./api/products');
const reviews = require('./api/reviews');

function route(app) {
  // Auth routes
  app.use('/api/auth', auth);

  // Product routes
  app.use('/api/products', products);

  // Review routes
  app.use('/api/reviews', reviews);
}

module.exports = route;