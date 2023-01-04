// let fs = require('fs');
// let axios = require('axios');
// process['env']['NODE_ENV'] = process['env']['NODE_ENV'] || 'production'; // development || production

// let { contractsApi } = require('./config/environment');
// let envoirments = ['development', 'production'];

// for (let env of envoirments) {
//     axios.get(`${contractsApi}/${env}`).then(async ({ data }) => {
//         let required = ['ICO', 'Token'];
//         for (let key of required)
//             if (!data[key] || data[key] == '' || data[key] == undefined || data[key] == null)
//                 return console.log(`Please provide ${key}`);

//         fs.writeFileSync(`./config/contract/${env}/ICO.json`, JSON.stringify(data['ICO']));
//         fs.writeFileSync(`./config/contract/${env}/Token.json`, JSON.stringify(data['Token']));
//     }).catch(e => console.log(e));
// }