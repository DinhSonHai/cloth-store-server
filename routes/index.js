const auth = require('./api/auth');
const products = require('./api/products');
const categories = require('./api/categories');
const reviews = require('./api/reviews');
const sizes = require('./api/sizes');
const colors = require('./api/colors');
const orders = require('./api/orders');

function route(app) {
  // Auth routes
  app.use('/api/auth', auth);

  // Product routes
  app.use('/api/products', products);

  // Category routes
  app.use('/api/categories', categories);

  // Review routes
  app.use('/api/reviews', reviews);

  // Size routes
  app.use('/api/sizes', sizes);

  // Color routes
  app.use('/api/colors', colors);

  // Order routes
  app.use('/api/orders', orders);
}

module.exports = route;