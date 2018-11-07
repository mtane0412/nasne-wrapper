'use strict'

require('dotenv').config({
    path: __dirname + '/.env'
});
const request = require('request-promise');

module.exports = function (Nasne) {
    Nasne.prototype.remoteListGet = (callback) => {
        const options = {
            url: `http://${process.env.NASNE_IP}:64210/status/remoteListGet`,
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
                dataType: "remoteListGet",
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