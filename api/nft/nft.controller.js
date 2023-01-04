'use strict';

const fs = require('fs');
const Web3 = require('web3');
const basePath = process.cwd();
const axios = require('axios');
const ethers = require('ethers');
const helper = require('./helper');
const rarity = require('./rarity');
const { createHash } = require("crypto");
const Sold = require('./model/sold.model');
const { RateLimit } = require("async-sema");
const openSeaApis = require('./openseaApis');
const RarityDetail = require('./model/rarity.model');
const BiddDetail = require('./model/biddDetail.model');
const Collection = require('./model/collection.model');
const NftDetail = require('./model/nftDetails.model');
const config = require('../../config/environment');
const { OpenSeaPort, Network } = require('opensea-js');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { SUCCESS, BADREQUEST } = require('../../config/resCodes');
const { web3, TokenABI } = require('../../config/contract/index')
const { sendResponse, errReturned } = require('../../config/dto');



exports.biddBot = async (req, res) => {
    try {

        // Send Token array of IDs in ascending order in idArrays //

        let { contractAddress, amount, time, fromId, toId, idArrays } = req['body'];
        let arrID = [];

        const Token = new web3.eth.Contract(TokenABI, contractAddress);
        // to see if correct info is being provided and stroing in array //

        if (fromId > 0 && toId >= 1 && idArrays.length == 0) {
            for (let i = fromId; i <= toId; i++) {
                arrID.push(i);
            }
        } else if (fromId > 0 && toId > 0 && idArrays.length > 0) {
            return sendResponse(res, BADREQUEST, "UNSUCCESSFUL", "Please provide the required information");
        } else if (idArrays.length == 0 && fromId == null && toId == null) {
            return sendResponse(res, BADREQUEST, "UNSUCCESSFUL", "Please provide the required information");
        } else {
            arrID = idArrays;
        };
        const totalSupply = await Token.methods.totalSupply().call();
        let startingTokenId = 0;
        try {
            await Token.methods.tokenURI(startingTokenId).call();
        } catch (e) {
            startingTokenId += 1;
            await Token.methods.tokenURI(startingTokenId).call();
        }
        const cacheHash = createHash('sha256').update(contractAddress + totalSupply.toString()).digest('hex');
        console.log("******* HASH", cacheHash)
        const cacheFileName = 'cache/' + cacheHash + '.json';
        const existsFile = fs.existsSync(cacheFileName);

        let cacheFile;

        if (existsFile) {
            cacheFile = fs.readFileSync(cacheFileName);
        }
        class Asset {
            constructor(tokenId, contractAddress, metadata) {
                this.tokenId = tokenId;
                this.contractAddress = contractAddress;
                this.attributes = metadata.attributes;
            }
        }

        const metadataCalls = [];
        let assets = [];

        // iterate over all possible token ids and create assets with metadata
        for (let i = startingTokenId; i < totalSupply && !existsFile; i++) {

            assets.push(new Asset(i, contractAddress, []));
        }

        await Promise.allSettled(metadataCalls);

        if (existsFile) {
            console.log('[DEBUG]', new Date(), 'Loading assets from cache file');

            assets = JSON.parse(cacheFile.toString());
        }

        // fs.writeFileSync(cacheFileName, JSON.stringify(assets));

        const wallet = new HDWalletProvider(process.env.PRIVATE_KEY, process.env.PROVIDER);
        const walletAddress = await wallet.getAddress();

        const ratelimitOpensea = new RateLimit(parseInt(process.env.OPENSEA_RATELIMIT_MIN), { timeUnit: 60000, uniformDistribution: true });

        const seaport = new OpenSeaPort(wallet, {
            networkName: Network.Rinkeby,
            apiKey: process.env.OPENSEA_API_KEY
        }, (arg) => console.log('[DEBUG]', new Date(), arg));
        let bidDetails = [];
        const offerCalls = [];
        // for (const nft of assets) {
        for (let id = 0; id <= assets.length; id++) {
            const tokenId = assets[id].tokenId;
            const contractAddress = assets[id].contractAddress;
            const schema = 'ERC721';
            await ratelimitOpensea();


            // INER LOOP for bidding on only those which are provided
            // if same id appear then bid
            for (let array = 0; array <= arrID.length; array++) {
                if (tokenId === arrID[array]) {
                    bidDetails.push({
                        nftId: tokenId,
                        biddPrice: amount,
                    })
                    const offerCall = seaport.createBuyOrder({
                        asset: {
                            tokenId: tokenId,
                            tokenAddress: contractAddress,
                            schemaName: schema
                        },
                        accountAddress: walletAddress,
                        // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
                        startAmount: parseFloat(amount),
                        expirationTime: Math.round(Date.now() / 1000 + 60 * parseInt(time)) // 15 minute from now
                    });
                    offerCalls.push(offerCall);
                    offerCall
                        .then(function (offer) {

                            console.log('[DEBUG]', new Date(), `Offer placed, expires in ${time}min`, offer.hash, offer.metadata.asset);
                        })
                        .catch(function (error) {
                            console.log('[ERROR]', new Date(), 'Offer failed', error);
                        });

                }
            }
            let newBidds = {
                collectionAddress: contractAddress,
                bidCollections: bidDetails
            }

            if (bidDetails.length === arrID.length) {
                await BiddDetail.create(newBidds);
                return sendResponse(res, SUCCESS, "bidding completed", bidDetails);
            }
        }
    } catch (error) {
        errReturned(res, error)
    }
}

/**
 * Scrap Collection API
 */

exports.GetCollection = async (req, res) => {
    try {
        const { collection_slug } = req['body'];
        if (collection_slug == null || collection_slug == "") {
            return sendResponse(res, BADREQUEST, "UNSUCCESSFUL", "Please provide the required information");
        };
        let response = await openSeaApis.getCollectionInfoTest({ collection_slug })

        const randomNumber = Math.floor(Math.random() * 10000000000);
        let collectionName = response['primary_asset_contracts'][0]['name'] ?
            response['primary_asset_contracts'][0]['name'] : '';
        let collectionAddress = response['primary_asset_contracts'][0]['address'] ?
            response['primary_asset_contracts'][0]['address'] : '';
        let collectionImage = response['primary_asset_contracts'][0]['image_url'] ?
            response['primary_asset_contracts'][0]['image_url'] : '';
        let collectionQuantity = response['stats']['total_supply'] ?
            response['stats']['total_supply'] : '';
        let collectionFloor = response['stats']['floor_price'] ?
            response['stats']['floor_price'] : '';
        const addCollection = {
            collectionName: collectionName,
            collectionImage: collectionImage,
            collectionAddress: collectionAddress,
            collectionQuantity: collectionQuantity,
            collectionFloor: collectionFloor,
            nonce: randomNumber
        }
        let collectionDetails = await Collection.findOne({ collectionAddress });
        if (!collectionDetails) {
            let collection = await Collection.create(addCollection);
            if (collection) return sendResponse(res, 200, "SUCCESS", collection);
        }
        return sendResponse(res, 200, "SUCCESS", collectionDetails);
        return sendResponse(res, BADREQUEST, "UNSUCCESSFUL", response['data']);
    } catch (error) {
        errReturned(res, error)
    }
}

/**
 * Scrap nft collection and calculate rarities and save in db
 */
exports.calculateRarities = async (req, res) => {
    try {
        const { contractAddress, networkChain } = req['body'];
        if (networkChain == null || networkChain == "" || contractAddress == null || contractAddress == "") {
            return sendResponse(res, BADREQUEST, "UNSUCCESSFUL", "Please provide the required information");
        };
        let response = await rarity.calculateRarities({ contractAddress, networkChain });
        let rarityCollection = [];
        for (let i = 0; i < response.length; i++) {
            let rank = response[i]?.['rank'];
            let name = response[i]?.['metadata']?.['name'];
            rarityCollection.push({
                nftName: name,
                nftRank: rank,
            })
        }
        await RarityDetail.updateOne({ collectionAddress: contractAddress }, { $set: { collectionAddress: contractAddress, collectionRarity: rarityCollection } }, { upsert: true }, (err) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
        });
        if (response) return sendResponse(res, SUCCESS, "SUCCESS", rarityCollection);
        return sendResponse(res, BADREQUEST, "UNSUCCESSFUL", response);
    } catch (error) {
        errReturned(res, error)
    }
}
/**
 * Get top rarities from the dabase
 */
exports.getRarity = async (req, res) => {
    try {
        const { limit, contractAddress } = req['body'];
        if (limit == null || limit == "" || contractAddress == null || contractAddress == "") {
            return sendResponse(res, BADREQUEST, "UNSUCCESSFUL", "Please provide the required information");
        };
        if (limit) {
            let sorted = await RarityDetail.aggregate([
                { $match: { collectionAddress: contractAddress } }, //filter docs
                { $unwind: "$collectionRarity" }, // unwind array
                { $sort: { "collectionRarity.nftRank": 1 } },
                { "$limit": limit },
                { $group: { _id: "$_id", collectionRarity: { $push: "$collectionRarity" } } } // Re-group messages array
            ])
            if (sorted) {
                return sendResponse(res, SUCCESS, "SUCCESS", sorted);
            }
        } else {
            return sendResponse(res, BADREQUEST, "UNSUCCESSFUL", "Please provide limit");
        }
    } catch (error) {
        errReturned(res, error)
    }
}

/**
 * Get Sold Items API
 */
exports.GetCollectionSales = async (req, res) => {
    try {
        const { collection_slug } = req['body'];
        if (collection_slug == null || collection_slug == "") {
            return sendResponse(res, BADREQUEST, "UNSUCCESSFUL", "Please provide the required information");
        };
        let response = await openSeaApis.GetCollectionSalesInfo({ collection_slug })

        let collectionName = response[0]['asset']['asset_contract']['name'];
        let collectionAddress = response[0]['asset']['asset_contract']['address'];
        let sales = response.map(items => {
            let getData = {
                saleName: items['asset']['name'],
                salePrice: items['total_price'] / 1000000000000000000,
                saleLink: items['asset']['permalink'],
                saleFrom: items['transaction']['from_account']['address'],
                saleTo: items['transaction']['to_account']['address'],
            }
            return getData;
        });
        let addSales = {
            collectionName: collectionName,
            collectionAddress: collectionAddress,
            collectionSales: sales
        }

        let collectionDetails = await Sold.findOne({ collectionAddress });
        if (!collectionDetails) {
            let collection = await Sold.create(addSales);
            if (collection) return sendResponse(res, 200, "SUCCESS", collection);
        }
        else {
            return sendResponse(res, 200, "SUCCESS", collectionDetails);
        }
        return sendResponse(res, BADREQUEST, "UNSUCCESSFUL", response['data']);
    } catch (error) {
        errReturned(res, error)
    }
}

/**
 * Scrap NFT collection, save information, calculate Floor and ceiling price and save in db
 */
exports.getAllNft = async (req, res) => {
    try {
        ///////////////////////////////////////////////////////////////
        // From Collection Slug getting address on collection and total supply
        const { collection_slug } = req['body'];
        if (collection_slug == null || collection_slug == "") {
            return sendResponse(res, BADREQUEST, "UNSUCCESSFUL", "Please provide the required information");
        };
        let response = await openSeaApis.getCollectionInfo({ collection_slug });
        let collectionAddress = response['primary_asset_contracts'][0]['address'] ?
            response['primary_asset_contracts'][0]['address'] : '';
        let totalSupply = response['stats']['total_supply'] ?
            response['stats']['total_supply'] : '';
        let nftArray = [];
        let floorAvergaqe = 0;
        let floorPriceArray = [];
        let ceilingFloorPrice = 0;
        ///////////////////////////////////////////////////////////////
        // from address and total supply , we are getting all nfts list in a collection
        for (let i = 1; i <= totalSupply; i++) {
            console.log("***** nft id", i)
            let response = await openSeaApis.getNftAsset({ collectionAddress, i });

            let nameNft = response['name'] ?
                response['name'] : '';
            let nftID = response['token_id'] ?
                response['token_id'] : '';
            let nftPermaLink = response['permalink'] ?
                response['permalink'] : '';

            ///////////////////////////////////////////////////////////////
            // calculating floor price of each nft in a list
            let responseData = await openSeaApis.getFloorPrice({ collectionAddress, i });

            for (let i = 0; i < responseData.length; i++) {
                if (responseData[i]?.current_price != undefined || responseData[i]['current_price'] != null) {
                    floorAvergaqe += parseFloat(responseData[i].current_price);
                    floorPriceArray.push(parseFloat(responseData[i].current_price));
                }
            }
            ceilingFloorPrice = Math.max(...floorPriceArray);
            const eThValue = parseFloat(Web3.utils.fromWei(`${floorAvergaqe}`, 'ether')) / responseData.length;
            const ceilingPrice = parseFloat(Web3.utils.fromWei(`${ceilingFloorPrice}`, 'ether'));
            nftArray.push({
                nftName: nameNft,
                nftID: nftID,
                nftLink: nftPermaLink,
                nftFloorPrice: eThValue,
                nftCeilingPrice: ceilingPrice
            })
        }
        await NftDetail.updateOne({ collectionAddress: collectionAddress }, { $set: { collectionAddress: collectionAddress, nftDetail: nftArray } }, { upsert: true }, (err) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
        });
        if (nftArray) return sendResponse(res, SUCCESS, "SUCCESS", nftArray);
        return sendResponse(res, BADREQUEST, "UNSUCCESSFUL", response['data']);
    } catch (error) {
        errReturned(res, error)
    }
}
