'use strict'

require('dotenv').config({ PATH: __dirname + '/.env'});
const request = require('request-promise');

module.exports = function (Nasne) {
    Nasne.prototype.HDDInfoGet = (callback) => {
        const options = {
            url: `http://${process.env.NASNE_IP}:64210/status/HDDInfoGet`,
            qs: {
                id: '0'
            },
            timeout: 60000,
            method: "GET",
            json: true
        }
        request(options, function (error, response, body) {
            if (error) { console.log(error); } 
            const result = {
                type: "nasne",
                token: process.env.TOKEN,
                volumeCaution: false,
                usedVolumeSize: body.HDD.usedVolumeSize,
                freeVolumeSize: body.HDD.freeVolumeSize,
                totalVolumeSize: body.HDD.totalVolumeSize
            };
            const remainVolumeSize = Math.round(result.freeVolumeSize / result.totalVolumeSize * 100);
            if (remainVolumeSize < 10 ) { result.volumeCaution = true; }
            if (callback) { callback(result); }
            return result;
        })
    }
}