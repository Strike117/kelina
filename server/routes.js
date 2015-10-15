/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/servicekeeper/api/requests', require('./api/request'));
  app.use('/servicekeeper/api/things', require('./api/thing'));
  

};
