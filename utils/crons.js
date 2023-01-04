'use strict';

const cron = require('node-cron');

// const User = require('../api/user/user.model');
const { Token } = require('../config/contract');
const Collections = require('../api/nft/nft.model');
const { web3, web3Royality } = require('../utils/web3');
const Retweet = require('../api/nft/retweet.model');

let inProgress = false;
let companyWallet = '0x79E0fee1a646d84930d1ad774667851362DF17eB'; // Needs to be replaced

/*  Royalities Distribution  */
cron.schedule('*/5 * * * * *', async () => {
    // if(!inProgress) {
    //     inProgress = true;

    //     /**************** Get All Family Holders ****************/
    //     let familyHolders = await getAllFamilyHolders();
    //     console.log('familyHolders = ', familyHolders);
    //     console.log('Total familyHolders = ', Object.keys(familyHolders).length);

    //     /************** Get All Snack Jar Members **************/
    //     let snackJarMembers = await User.find({role: 'snackJar'});
    //     console.log(snackJarMembers);

    //     let royalityFrom = (await web3Royality.eth.getAccounts())[0];
    //     console.log('royalityFrom = ', royalityFrom);

    //     // let totalRoyalties = await web3.eth.getBalance("Royalty Address");
    //     /************** Send 50% to Company Wallet **************/

    //     /************** Send 25% to Family Holders **************/

    //     /************** Send 25% to Snack Jar Members **************/

    //     // inProgress = false;
    // }
});

function getAllFamilyHolders() {
    return new Promise(async (resolve, reject)=> {
        try {
            let familyHolders = {};
            let pterodactyl = await Collections.find({dinoType: 'Pterodactyl'});

            let totalSupply = await Token.methods.totalSupply().call();
            for(let x=0; x < pterodactyl.length; x++) {
                let id = pterodactyl[x]['no'];
                if(totalSupply > id) {
                    let tokenOwner = await Token.methods.ownerOf(id).call();

                    let allToken = await Token.methods.walletOfOwner(tokenOwner).call();
                    if(allToken.length >= 4) {
                        let allNFT = await Collections.find({no: {$in: allToken}});

                        let types = {}
                        for(let nft of allNFT) {
                            types[nft['dinoType']] = true;
                        }
                        if(Object.keys(types).length == 4) familyHolders[tokenOwner] = true;
                    }
                }
            }
            resolve(familyHolders);
        } catch(e) { reject(e) }
    });
}