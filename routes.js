/**
   * Main application routes
*/

'use strict';

module.exports = (app) => {
  // app.use('/auth', require('./auth'));
  app.use('/api/nft', require('./api/nft'));
};