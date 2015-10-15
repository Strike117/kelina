/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var RequestM = require('./api/request/request.model');
var StringDecoder = require('string_decoder').StringDecoder,
  decoder = new StringDecoder('utf8');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});
// Populate DB with sample data
if (config.seedDB) {
  require('./config/seed');
}

// Setup server
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');

require('./config/express')(app);

require('./routes')(app);

var proxy = require('express-http-proxy');
// var apiProxy = proxy('http://10.50.24.142:8080/', {
// var apiProxy = proxy('204.151.185.164:9090', {
var apiProxy = proxy('http://feedback-tool.cfappstpanpaz2.verizon.com', {
  forwardPath: function(req, res) {
    console.log('req.url', req.url);
    return require('url').parse(req.url).path;
  },
  intercept: function(rsp, data, req, res, callback) {
    // rsp - original response from the target
    //console.log('typeof',typeof data);
    //console.log('data.toString',data);
    //console.log(rsp);
    var dataJSON = data;
    try {
      dataJSON = JSON.parse(decoder.write(data));

    } catch (e) {
      console.log(e);
    }

    RequestM.update({
      path: req.path
    }, {
      path: req.path,
      headers: req.headers,
      response: {
        data: dataJSON,
        databuffer: data,
        headers: rsp.headers
      }
    }, {
      upsert: true
    }, function(err, request) {
      if (err) console.log(err);
    });

    callback(null, data);
  },
  decorateRequest: function(req) {
    RequestM.update({
      path: req.path
    }, req, {
      upsert: true
    }, function(err, request) {
      if (err) console.log(err);
    });
    return req
  }
});

//use on get and post
app.all("*", apiProxy);
app.all("*", function(req, res, next) {
  console.log(req.url);
  console.log(req.path);
  RequestM.findOne({
    path: req.path
  }, function(err, request) {
    if (err) {
      console.log(err);
      res.send('');
    } else {
      if (request && request.response && request.response.headers) {
        res.headers = request.response.headers;
      }
      if (request && request.response && request.response.databuffer) {
        res.send(request.response.databuffer);
      } else {
        res.send('');
      }
    }
  });

});

// Start server
server.listen(config.port, config.ip, function() {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
