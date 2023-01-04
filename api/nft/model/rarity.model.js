'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RaritySchema = new Schema({
  nftRank: {type: Number},
  collectionAddress: {type: String},
  collectionRarity: {type: Schema.Types.Mixed},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('RarityDetail', RaritySchema);