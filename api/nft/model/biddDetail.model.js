'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var biddDetailSchema = new Schema({
  nftId: {type: Number},
  collectionAddress: {type: String},
  biddPrice: {type: Number},
  txHash: {type: String},
  bidCollections: {type: Schema.Types.Mixed},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('biddDetail', biddDetailSchema);