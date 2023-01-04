'use strict';
module.exports = {
  allCategories: ['Art', 'Photo', 'Music', 'Domain', 'Defi'],

  ledgerTypes: ['Deposit', 'Withdraw'],
  accountType: ['personal', 'corporate'],

  coinCategory: ['crypto', 'fiat'],
  
  spotAction: ['buy', 'sell'],
  spotOrderTypes: ['limit', 'market'],

  landingCoins: {
    'BTCUSDT': {name: 'Bitcoin', symbol: 'BTC'}, 
    'ETHUSDT': {name: 'Ethereum', symbol: 'ETH'}, 
    'DASHUSDT': {name: 'Dashcoin', symbol: 'DASH'}, 
    'LTCUSDT': {name: 'Litecoin', symbol: 'LTC'}, 
    'BCHUSDT': {name: 'Bitcoin Cash', symbol: 'BCH'}
  },

  globitexPairs: {
    BTCEUR: { symbol: 'BTC/EUR', name: 'Bitcoin' },
    ETHEUR: { symbol: 'ETH/EUR', name: 'Ethereum' }
  }
};
