'use strict'
const axios = require('axios');
const getUrl = require('./util/getUrl');
const getQueryString = require('./util/getQueryString');
const checkEndpoint = require('./util/checkEndpoint');

class Nasne {
    constructor(ip) {
        if (!ip) {
            throw TypeError("nasneのIPアドレスを指定してください");
        }
        this.ip = ip;
    }

    fetch(endpoint, option = 0) {
        const url = getUrl(endpoint, this.ip);
        const queryString = getQueryString(endpoint, option);
        const config = {
            params: queryString,
            timeout: 10000,
        }
        return axios.get(url, config)
            .then(response => response.data);
    }

    checkEndpoint(endpoint) {
        const self = this;
        return checkEndpoint(self, endpoint);
    }
}

module.exports = Nasne;
