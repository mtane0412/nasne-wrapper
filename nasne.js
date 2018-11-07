'use strict'
const request = require('request');

class Nasne {
    constructor(ip) {
        if (!ip) {
            throw new Error("nasneのIPアドレスを指定してください");
        }
        this.ip = ip;
    }

    fetch(method, callback, supplement) {
        let port, path, queryString;
        if (method === 'titleListGet' || method === 'reservedListGet') {
            port = '64220';
            if (method === 'titleListGet') {
                path = 'recorded';
            } else {
                path = 'schedule';
            }
            queryString = {
                searchCriteria: 0,
                filter: 0,
                startingIndex: 0,
                requestedCount: 0,
                sortCriteria: 0,
                withDescriptionLong: 1,
                withUserData: 0
            }
        } else {
            port = '64210';
            path = 'status';
            if (method === "HDDInfoGet") {
                if (!supplement) {
                    queryString = {
                        id: '0'
                    }
                } else if (supplement == 0 || supplement == 1) {
                    queryString = {
                        id: String(supplement)
                    }
                } else {
                    throw new Error('HDD idが不正です。引数を指定する場合は次のいずれかのidを指定してください。\n 0: 内蔵HDD(デフォルト) \n 1: 外付けHDD');
                }

            }
        }

        const options = {
            url: `http://${this.ip}:${port}/${path}/${method}`,
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
            return result;
        })
    }
}

module.exports = Nasne;