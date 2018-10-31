'use strict'

const Nasne = require('./nasne.js');
const postToGAS = require('./postToGAS.js');

const nasne = new Nasne('192.168.11.2');

nasne.titleListGet(postToGAS);