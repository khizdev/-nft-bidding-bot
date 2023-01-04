const axios = require('axios');
let dotenv = require('dotenv');
const { response } = require('express');
const { reject } = require('lodash');
const { promises } = require('nodemailer/lib/xoauth2');
dotenv.config();



exports.getCollectionInfo = async ({ collection_slug }) => {
    return new Promise(async (resolve, reject) => {
        let URI = `${process.env.openseaMainnetUri}/collection/${collection_slug}`;
        let response = await axios.get(URI, {
            headers: {
                'X-API-KEY': process.env.OPENSEA_API_KEY_MAINNET
            }
        });
        if (response) resolve(response['data']['collection'])
    }).catch(e => reject(e));
}

exports.getCollectionInfoTest = async ({ collection_slug }) => {
    return new Promise(async (resolve, reject) => {
        let URI = `${process.env.openseaBaseUri}/collection/${collection_slug}`;
        let response = await axios.get(URI, {
            headers: {
                'X-API-KEY': process.env.OPENSEA_API_KEY
            }
        });
        if (response) resolve(response['data']['collection'])
    }).catch(e => reject(e));
}

exports.GetCollectionSalesInfo = async ({ collection_slug }) => {
    return new Promise(async (resolve, reject) => {
        let URI = `${process.env.openseaBaseUri}/events?collection_slug=${collection_slug}&event_type=successful&only_opensea=true`;
        let response = await axios.get(URI, {
            headers: {
                'X-API-KEY': process.env.OPENSEA_API_KEY
            }
        });
        if (response) resolve(response['data']['asset_events'])
    }).catch(e => reject(e));
}



exports.getNftAsset = async ({ collectionAddress, i }) => {
    return new Promise(async (resolve, reject) => {
        let URI = `${process.env.openseaMainnetUri}/asset/${collectionAddress}/${i}`;
        let response = await axios.get(URI, {
            headers: {
                'X-API-KEY': process.env.OPENSEA_API_KEY_MAINNET
            }
        });
        if (response) resolve(response['data'])
    }).catch(e => reject(e));
}

exports.getFloorPrice = async ({ collectionAddress, i }) => {
    return new Promise(async (resolve, reject) => {
        let URI = `${process.env.openseaMainnetUri}/asset/${collectionAddress}/${i}/offers?limit=50`;
        let response = await axios.get(URI, {
            headers: {
                'X-API-KEY': process.env.OPENSEA_API_KEY_MAINNET
            }
        });
        if (response) resolve(response['data']['offers'])
    }).catch(e => reject(e));
}

