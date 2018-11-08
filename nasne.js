'use strict'
const request = require('request');
const getUrl = require('./util/getUrl');
const getQueryString = require('./util/getQueryString');
const checkEndpoints = require('./util/checkEndpoints');

class Nasne {
    constructor(ip) {
        if (!ip) {
            throw new Error("nasneのIPアドレスを指定してください");
        }
        this.ip = ip;
    }

    fetch(endpoint, callback, supplementary) {
        if (endpoint === 'test') {
            const self = this;
            return checkEndpoints(self);
        }
        const url = getUrl(endpoint, this.ip);
        const queryString = getQueryString(endpoint, supplementary);
        const options = {
            url: url,
            qs: queryString,
            timeout: 10000,
            method: "GET",
            json: true
        }
        request(options, function (error, response, body) {
            if (error) {
                throw error;
            }
            const result = {
                type: "nasne",
                endpoint: endpoint,
                body: body
            };
            if (callback) {
                callback(result);
            }
            return body;
        })
    }
}

module.exports = Nasne;