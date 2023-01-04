'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var nftDetailSchema = new Schema({
  nftId: {type: Number},
  nftName:{type: String},
  nftLink: {trype: String},
  nftFloorPrice: {type: Number},
  nftCeilingPrice: {type: Number},
  collectionAddress: {type: String},
  nftDetail: {type: Schema.Types.Mixed},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('nftDetail', nftDetailSchema);