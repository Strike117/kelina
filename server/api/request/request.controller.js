'use strict';

var _ = require('lodash');
var Request = require('./request.model');

// Get list of requests
exports.index = function(req, res) {
  Request.find(function (err, requests) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(requests);
  });
};

// Get a single request
exports.show = function(req, res) {
  Request.findById(req.params.id, function (err, request) {
    if(err) { return handleError(res, err); }
    if(!request) { return res.status(404).send('Not Found'); }
    return res.json(request);
  });
};

// Creates a new request in the DB.
exports.create = function(req, res) {
  Request.create(req.body, function(err, request) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(request);
  });
};

// Updates an existing request in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Request.findById(req.params.id, function (err, request) {
    if (err) { return handleError(res, err); }
    if(!request) { return res.status(404).send('Not Found'); }
    var updated = _.merge(request, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(request);
    });
  });
};

// Deletes a request from the DB.
exports.destroy = function(req, res) {
  Request.findById(req.params.id, function (err, request) {
    if(err) { return handleError(res, err); }
    if(!request) { return res.status(404).send('Not Found'); }
    request.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}