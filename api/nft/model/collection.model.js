'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CollectionSchema = new Schema({
  collectionName: {type: String},
  collectionImage: {type: String},
  collectionAddress: {type: String},
  collectionQuantity: {type: Number},
  collectionFloor: {type: Number},
  collectionSales: {type: Schema.Types.Mixed},
  nonce: { type: Number, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Collection', CollectionSchema);
