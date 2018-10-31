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
                usedVolumeSize: body.HDD.usedVolumeSize,
                freeVolumeSize: body.HDD.freeVolumeSize,
                totalVolumeSize: body.HDD.totalVolumeSize,
                remainVolumePercentage: Math.round(body.HDD.freeVolumeSize / body.HDD.totalVolumeSize * 100)
            };
            if (callback) { callback(result); }
            return result;
        })
    }
}