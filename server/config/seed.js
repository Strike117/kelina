/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// Insert seed models below
var Request = require('../api/request/request.model');
var Thing = require('../api/thing/thing.model');


// Insert seed data below
var requestSeed = require('../api/request/request.seed.json');
var thingSeed = require('../api/thing/thing.seed.json');

// Insert seed inserts below
Request.find({}).remove(function() {
	Request.create(requestSeed);
});

Thing.find({}).remove(function() {
  Thing.create(thingSeed);
});