'use strict'

require('dotenv').config({ path: __dirname + '/.env' });
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
                dataType: "HDDInfoGet",
                usedVolumeSize: Math.round(body.HDD.usedVolumeSize / 1073741824),
                freeVolumeSize: Math.round(body.HDD.freeVolumeSize / 1073741824),
                totalVolumeSize: Math.round(body.HDD.totalVolumeSize / 1073741824),
                remainVolumePercentage: Math.round(body.HDD.freeVolumeSize / body.HDD.totalVolumeSize * 100)
            };
            if (callback) { callback(result); }
            return result;
        })
    }
}