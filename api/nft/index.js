'use strict';

const express = require('express');
const controller = require('./nft.controller');
const auth = require('../../auth/auth.service');


const router = express.Router();

//start bidding to a nft collection
router.post('/startBidd', controller.biddBot);

// calcute rarities of a collection and save it on file
router.post('/calculateRarities', controller.calculateRarities);

//get rairity of nfts
router.get('/getRarity',controller.getRarity);

// Scrapping collection from opensea
router.get('/getCollection', controller.GetCollection);

//Scrapping sales of a collection from opensea
router.get('/getCollectionSales', controller.GetCollectionSales);

//Scrapping nft record and calculating Floor and ceiling price
router.post('/getAllNft',controller.getAllNft)


module.exports = router;