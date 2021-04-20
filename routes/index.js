const auth = require('./api/auth');
const products = require('./api/products');
const categories = require('./api/categories');
const reviews = require('./api/reviews');
const sizes = require('./api/sizes');
const colors = require('./api/colors');
const orders = require('./api/orders');
const collections = require('./api/collections');
const types = require('./api/types');

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

  // Collection routes
  app.use('/api/collections', collections);

  // Type routes
  app.use('/api/types', types);
}

module.exports = route;
