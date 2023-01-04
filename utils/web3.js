const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

// let web3Royality = new Web3(new HDWalletProvider( process['env']['ROYALITY_WALLET_PV_KEY'], process['env']['INFURA_API_KEY']));

// const web3 = new Web3(new HDWalletProvider(
//   process['env']['PRIVATE_KEY'],
//   process['env']['INFURA_API_KEY']
// ));
let web3 = new Web3(new Web3.providers.HttpProvider(process['env']['PROVIDER']));

module.exports = { web3 };