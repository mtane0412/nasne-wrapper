'use strict'

const request = require('request');

module.exports = function postToGAS(titleList, HDD, nowId) {
    if (!titleList && !HDD && !nowId) {
        throw typeError("引数が正しくありません");
    }
    const body = {
        type: 'nasne',
        token: process.env.TOKEN,
        titleList: titleList,
        HDD: {
            // GBに変換
            usedVolumeSize: Math.round(HDD.usedVolumeSize / 1073741824),
            freeVolumeSize: Math.round(HDD.freeVolumeSize / 1073741824),
            totalVolumeSize: Math.round(HDD.totalVolumeSize / 1073741824),
            remainVolumePercentage: Math.round(HDD.freeVolumeSize / HDD.totalVolumeSize * 100)
        },
        nowId: nowId ? nowId : false
    }
    const options = {
        uri: process.env.GAS_URL,
        method: "POST",
        timeout: 10000,
        followAllRedirects: true,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body) // 特殊文字を変換
            .replace(/\ue195/g, "[終]")
            .replace(/\ue193/g, "[新]")
            .replace(/\ue0fe/g, "[字]")
            .replace(/\uE184/g, "[解]")
            .replace(/\uE183/g, "[多]")
            .replace(/\uE180/g, "[デ]")
    };
    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            console.log(`${new Date()}: posted.`)
            console.log(body);
        } else {
            console.log(body);
            throw error;
        }
    })
}