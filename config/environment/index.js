'use strict';

const _ = require('lodash');
const path = require('path');
// const aws = require('aws-sdk');
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv');

const isProduction = false;
process['env']['NODE_ENV'] = process['env']['NODE_ENV'] || 'development';

// aws.config.update({
//   region: process['env']['AWS_REGIONS'],
//   accessKeyId: process['env']['AWS_KEY'],
//   secretAccessKey: process['env']['AWS_SECRET']
// });

const all = {
  isProduction,
  env: process['env']['NODE_ENV'],

  // Frontend path to server
  assets: express.static(__dirname + '/../../public'),
  view: path.normalize(__dirname + '/../../public/index.html'),

  // Server port
  port: process.env.PORT || 4000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data ?
  seedDB: true,

  secrets: { session: 'Baby_Dinos_s3cr3t_2018' },
  // List of user roles
  userRoles: ['guest', 'user', 'affiliateAdmin', 'kycAdmin', 'admin'],

  mongo: {
    db_url: process['env']['dev_db_url'],
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    debug: false,
  },

  // Twillio Configurations
  // twillio: {
  //   from: '+17625857591',
  //   client: require('twilio')(`AC86ef1d3d136dfe8a70bbecfc88816e1c`, `52dfe954d0d5b792cf81ce1e13f3a518`)
  // },

  // Email Configurations
  // mailTransporter: nodemailer.createTransport({
  //   SES: new aws.SES({ apiVersion: '2010-12-01' })
  // }),

  project_name: 'Bad Baby Dinos',
  support_title: 'Baby Dinos Support',
  support_email: 'ammar@softtik.com',
  mail_footer: 'The Baby Dinos Team',
  mail_noreply: 'ammar@softtik.com',
  mail_from_name: 'babydinos NFT',
  mail_from_email: 'ammar@softtik.com',
  mail_to: ['developer@yopmail.com', 'badbabydinos@gmail.com'],
  // mail_logo: 'https://hotbit.com/assets/pic/logo.png',

  pepper: '78uA_PPqX&@$',
  encPass: 's1XrWeMEc2aJn1tu5HMp',
  rpc_secret: "4b8cf527e04e4a8abe40d9b2030129fckf546pwsasdfe",

  exchangeServer: isProduction ? 'http://139.59.19.210:3000' : 'http://192.168.0.128:3102',
};

/* Export the config object based on the NODE_ENV */
/*================================================*/

module.exports = _.merge(all, require(`./${process.env.NODE_ENV}.js`), require(`./constants`) || {});
