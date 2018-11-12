'use strict'
const request = require('request-promise');
const getUrl = require('./util/getUrl');
const getQueryString = require('./util/getQueryString');
const checkEndpoints = require('./util/checkEndpoints');

class Nasne {
    constructor(ip) {
        if (!ip) {
            throw typeError("nasneのIPアドレスを指定してください");
        }
        this.ip = ip;
    }

    fetch(endpoint, option = 0) {
        const url = getUrl(endpoint, this.ip);
        const queryString = getQueryString(endpoint, option);
        const options = {
            url: url,
            qs: queryString,
            timeout: 10000,
            method: "GET",
            json: true
        }
        return request(options)
    }

    checkEndpoints(endpoint) {
        const self = this;
        return checkEndpoints(self, endpoint);
    }
}

module.exports = Nasne;