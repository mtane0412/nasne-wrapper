'use strict'

const request = require('request-promise');

module.exports = function (Nasne) {
    Nasne.prototype.boxStatusListGet = (callback) => {
        const options = {
            url: `http://${process.env.NASNE_IP}:64210/status/boxStatusListGet`,
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
                dataType: "boxStatusListGet",
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