'use strict'

require('dotenv').config({
    path: __dirname + '/.env'
});

const Nasne = require('./nasne.js');
const postToGAS = require('./lib/postToGAS.js');

const nasne = new Nasne('192.168.11.2');

nasne.fetch('titleListGet', console.log);