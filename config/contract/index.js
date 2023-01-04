const { NODE_ENV } = process.env;
const { web3 } = require('../../utils/web3');

const TokenData = require(`./${NODE_ENV}/Token.json`);

const networks = {
  0: 'Disconnected',
  1: 'Mainnet',
  4: 'Rinkeby',
  42: 'Kovan',
}

const TokenABI = TokenData['abi'];
const TokenAddress = TokenData['address'];
// const Token = new web3.eth.Contract(TokenABI, TokenAddress);


module.exports = {
   TokenABI, web3 
};
