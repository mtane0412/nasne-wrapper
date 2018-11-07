'use strict'
const request = require('request');
const getUrl = require('./lib/getUrl');
const getQueryString = require('./lib/getQueryString');

class Nasne {
    constructor(ip) {
        if (!ip) {
            throw new Error("nasneのIPアドレスを指定してください");
        }
        this.ip = ip;
    }

    fetch(method, callback, supplementary) {
        const url = getUrl(method, this.ip);
        console.log(url);
        const queryString = getQueryString(method, supplementary);
        console.log(queryString);
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
            if (!body) {
                throw new Error("No response.");
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