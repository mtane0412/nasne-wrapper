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

    fetch(method, callback, supplementary) {
        if (method === 'test') {
            const self = this;
            return checkEndpoints(self);
        }
        const url = getUrl(method, this.ip);
        const queryString = getQueryString(method, supplementary);
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
                dataType: method,
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