'use strict'

const request = require('request-promise');

module.exports = function (Nasne) {
    Nasne.prototype.areaInfoGet = (callback) => {
        const options = {
            url: `http://${process.env.NASNE_IP}:64210/status/areaInfoGet`,
            timeout: 60000,
            method: "GET",
            json: true
        }
        request(options, function (error, response, body) {
            if (error) {
                throw error;
            }
            const result = {
                type: "nasne",
                dataType: "areaInfoGet",
                body: {
                    body
                }
            };
            if (callback) {
                callback(result);
            }
            return result;
        })
    }
}