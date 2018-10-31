'use strict'
const titleListGet = require('./titleListGet.js');

class Nasne {
    constructor (ip) {
        if (!ip) { console.log("nasneのIPアドレスが必要です。") };
        this.ip = ip;
        process.env.NASNE_IP = ip;
    }

    getIP(){
        console.log(this.ip);
        return this.ip;
    }

}

titleListGet(Nasne);

module.exports = Nasne;