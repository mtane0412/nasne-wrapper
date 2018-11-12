'use strict'

require('dotenv').config({
    path: __dirname + '/.env'
});

const Nasne = require('./nasne.js');
const postToGAS = require('./lib/postToGAS.js');

const nasne = new Nasne('192.168.11.2');


const CronJob = require('cron').CronJob;

const nasneJob = new CronJob('0 10 * * * *', () => {
    nasne.fetch("titleListGet")
        .then(async titleList => {
            let HDDInfo = await nasne.fetch("HDDInfoGet");
            let boxStatusList = await nasne.fetch("boxStatusListGet");
            postToGAS(titleList.item, HDDInfo.HDD, boxStatusList.tvTimerInfoStatus.nowId);
        })
        .catch(error => {
            throw error;
        })
});

nasneJob.start();