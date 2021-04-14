const auth = require('./api/auth');
const products = require('./api/products');
const reviews = require('./api/reviews');
const carts = require('./api/carts');
const sizes = require('./api/sizes');
const colors = require('./api/colors');

function route(app) {
  // Auth routes
  app.use('/api/auth', auth);

  // Product routes
  app.use('/api/products', products);

  // Review routes
  app.use('/api/reviews', reviews);

  // Cart routes
  app.use('/api/carts', carts);

  // Size routes
  app.use('/api/sizes', sizes);

  // COlor routes
  app.use('/api/colors', colors);
}

module.exports = route;