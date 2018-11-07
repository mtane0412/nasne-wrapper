'use strict'

require('dotenv').config({
    path: __dirname + '/.env'
});

const Nasne = require('./nasne.js');
const postToGAS = require('./lib/postToGAS.js');

const nasne = new Nasne('192.168.11.2');


const CronJob = require('cron').CronJob;

const job_titleListGet = new CronJob('0 10 * * * *', function () {
    nasne.fetch("titleListGet", postToGAS);
});

const job_HDDInfoGet = new CronJob('0 30 23 * * *', function () {
    nasne.fetch("HDDInfoGet", postToGAS, 0);
});

job_titleListGet.start();
job_HDDInfoGet.start();