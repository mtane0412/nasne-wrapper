'use strict'

const request = require('request-promise');
const moment = require('moment');

module.exports = function (Nasne) {
    Nasne.prototype.titleListGet = (callback) => {
        const options = {
            url: `http://${process.env.NASNE_IP}:64220/recorded/titleListGet`,
            qs: {
                searchCriteria: '0',
                filter: '0',
                startingIndex: '0',
                requestedCount: '0',
                sortCriteria: '0',
                withDescriptionLong: '1',
                withUserData: '0'
            },
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
                dataType: "titleListGet",
                body: body
            };
            if (callback) {
                callback(result);
            }
            return result;
        })
    }
}