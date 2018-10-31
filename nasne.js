'use strict'
const titleListGet = require('./titleListGet.js');
const HDDInfoGet = require('./HDDInfoGet.js');

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
HDDInfoGet(Nasne);

module.exports = Nasne;