const Collections = require('../api/nft/nft.model');

const { web3Socket, TokenAddress, TokenABI } = require('../config/contract');

let contract = new web3Socket.eth.Contract(TokenABI, TokenAddress);

contract.events.Mint({
    fromBlock: 0
}, function (error, event) {
    try {
        console.log('event 1', event);
    } catch (error) {
        console.log(`**** event1 ERROR`, error)
    }
})
    .on('data', async function (event) {
        await Collections.updateOne({ no: event['returnValues']['tokenId'] }, { $set: { status: "minted", mintDate: Date.now(), transactionHash: event['transactionHash'], owner: event['returnValues']['to'] } })
    });