'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RequestSchema = new Schema({
  url: String,
  path: String,
  method: String,
  headers: Schema.Types.Mixed,
  bodyContent: Schema.Types.Mixed,
  response: {
    headers: Schema.Types.Mixed,
    data: Schema.Types.Mixed,
    databuffer: Buffer
  }
});

module.exports = mongoose.model('Request', RequestSchema);
