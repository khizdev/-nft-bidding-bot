// const csvtojson = require("csvtojson");
const path = require("path");
const fs = require('fs');
// const AWS = require('aws-sdk');
// const mailgun = require("mailgun-js");
const axios = require('axios');

require('dotenv').config();

const ipfsFolder = '../ipfs-server/';
const config = require('../../config/environment');
// const { CostExplorer } = require("aws-sdk");

/**
 * create csv files
**/
// exports.postCSV = () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let data = await csvtojson().fromFile(path.resolve(ipfsFolder, 'dino_collection_v2.csv'));
//             if (data) return resolve(data)
//             return reject('no file found');
//         } catch (e) { reject(e) }
//     });
// }

/**
 * upload json files to s3 bucket
**/
// const s3 = new AWS.S3({
//     accessKeyId: process['env']['AWS_KEY'],
//     secretAccessKey: process['env']['AWS_SECRET']
// });

// exports.uploadFile = (value) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const fileName = `./json/${value}.json`;
//             fs.readFile(fileName, (err, data) => {
//                 if (err) throw err;
//                 const params = {
//                     Bucket: 'baby-dinos-collections-v2', // pass your bucket name
//                     Key: `${value}.json`, // file will be saved as testBucket/contacts.csv
//                     ACL: 'public-read',
//                     ContentType: "application/json",
//                     Body: data
//                 };
//                 s3.upload(params, function (s3Err, data) {
//                     if (s3Err) throw s3Err
//                     resolve(data.Location);
//                     console.log(`File uploaded successfully at ${data.Location}`)
//                 });
//             });
//         } catch (e) { reject(e) }
//     });
// };


/**
 * send emails
 */


// exports.sendDummyEmail = ({ name, email, message, country, company }) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             name = name || ''
//             const templatePath = 'mail_templates/sign_up.html';
//             let templateContent = fs.readFileSync(templatePath, "utf8");
//             templateContent = templateContent.replace("##REQ_TIME##", new Date());
//             templateContent = templateContent.replace("##USERNAME##", name);
//             templateContent = templateContent.replace("##EMAIL##", email);
//             templateContent = templateContent.replace("##COUNTRY##", country);
//             templateContent = templateContent.replace("##COMPANY##", company);
//             templateContent = templateContent.replace("##MESSAGE##", message);
//             templateContent = templateContent.replace("##USERNAME##", name);
//             // templateContent = templateContent.replace("##EMAIL_LOGO##", config.mail_logo);
//             // templateContent = templateContent.replace("##MAIL_FOOTER##", config.mail_footer);
//             templateContent = templateContent.replace(new RegExp("##PROJECT_NAME##", 'gi'), 'Test email');

//             // const data = {
//             //   from: config.mail_noreply,
//             //   to: config.mail_to,
//             //   html: templateContent,
//             //   subject: config.project_name,
//             // }

//             // config.mailTransporter.sendMail(data, (error, info) => {
//             //   if (error) console.log(error);
//             //   else console.log('Email sent:', info.envelope);
//             //   return resolve();
//             // });

//             const DOMAIN = 'thelandaftertime.com';
//             const mg = mailgun({ apiKey: '822eaf7381ee6bd5e82bc83fc0859ca0-1831c31e-6d73296a', domain: DOMAIN });
//             const data = {
//                 from: 'Bad Baby Dinos <info@thelandaftertime.com>',
//                 to: `${email}, info@thelandaftertime.com`,
//                 subject: config.project_name,
//                 html: templateContent
//             };
//             mg.messages().send(data, function (error, body) {
//                 console.log(body);
//                 return resolve();
//             });
//         } catch (e) { reject(e) }
//     });
// }


/**
* send user data from email
*/


// exports.sendUserData = ({ polygonAddress, image1, image2, image3, length, walletAddress }) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const templatePath = 'mail_templates/send_email.html';
//             let templateContent = fs.readFileSync(templatePath, "utf8");
//             templateContent = templateContent.replace("##ADDRESS##", polygonAddress);
//             templateContent = templateContent.replace("##NUMBEROFDINOS##", length);
//             templateContent = templateContent.replace("##HOLDING_ADDRESS##", walletAddress);
//             templateContent = templateContent.replace("##IMAGE1##", image1);
//             templateContent = templateContent.replace("##IMAGE2##", image2);
//             templateContent = templateContent.replace("##IMAGE3##", image3);
//             templateContent = templateContent.replace(new RegExp("##PROJECT_NAME##", 'gi'), 'Test email');

//             const DOMAIN = 'thelandaftertime.com';
//             const mg = mailgun({ apiKey: '822eaf7381ee6bd5e82bc83fc0859ca0-1831c31e-6d73296a', domain: DOMAIN });
//             const data = {
//                 from: 'Bad Baby Dinos <info@thelandaftertime.com>',
//                 to: `info@badbabydinos.com`,
//                 subject: config.project_name,
//                 html: templateContent
//             };
//             mg.messages().send(data, function (error, body) {
//                 console.log(body);
//                 return resolve();
//             });
//         } catch (e) { reject(e) }
//     });
// }


/**
 * read ipfs url
**/
exports.readIpfsData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            axios.get(data)
                .then(function (response) {
                    resolve(response)
                })
        } catch (e) { reject(e) }
    });
}






// Update [ADD_CONTRACT_ADDRESS] to your Contract Address
const OPENSEA_URI = 'https://api.opensea.io/asset/0xdf93e81f3231afaea101861ea3f6ca109fb075aa';

// update OPENSEA_URI
exports.refreshData = (tokenId) => {

    return new Promise(async (resolve, reject) => {
        try {
            const URI = `${OPENSEA_URI}/${tokenId}/?force_update=true`;
            console.log("************** url", URI)
            axios.get(URI)
                .then((response) => {
                    resolve(response);
                }).catch(err => console.error(`failed: ${tokenId}`));
        } catch (e) { reject(e) }
    });
};


exports.refreshTokens = (start, end) => {
    Array.from({ length: end - start + 1 }, (x, i) => start + i).forEach((tokenId) => {
        refreshData(tokenId);
    });
}
