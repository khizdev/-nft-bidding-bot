'use strict';
// Development specific configuration
// ==================================
module.exports = {
  clientDomain: 'https://dev.woofpack.com',
  contractsApi: 'http://52.15.219.83:4003/contracts',
  serverDomain: 'https://dserver.woofpack.com',

  mongo: {
    db_url: process['env']['dev_db_url'],
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    debug: false,
  },
  seedDB: true
};