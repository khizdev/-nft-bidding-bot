'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SoldSchema = new Schema({
  collectionName: {type: String},
  collectionAddress: {type: String},
  collectionSales: {type: Schema.Types.Mixed},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sold', SoldSchema);
