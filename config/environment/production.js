'use strict';
// Development specific configuration
// ==================================
module.exports = {
  clientDomain: 'https://badbabydinos.com',
  contractsApi: 'http://52.15.219.83:4003/contracts',
  serverDomain: "https://server.badbabydinos.com/api",

  mongo: {
    db_url: process['env']['database_url'],
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    debug: false,
  },
  seedDB: true
};
