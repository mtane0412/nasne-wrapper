'use strict'
const request = require('request-promise');
const getUrl = require('./util/getUrl');
const getQueryString = require('./util/getQueryString');
const checkEndpoint = require('./util/checkEndpoint');

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

    checkEndpoint(endpoint) {
        const self = this;
        return checkEndpoint(self, endpoint);
    }
}

module.exports = Nasne;