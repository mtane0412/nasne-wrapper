'use strict'

const axios = require('axios');

module.exports = function postToGAS(titleList, HDD, nowId) {
    if (!titleList && !HDD && !nowId) {
        throw TypeError("引数が正しくありません");
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

    const processedBody = JSON.stringify(body)
        .replace(/\ue195/g, "[終]")
        .replace(/\ue193/g, "[新]")
        .replace(/\ue0fe/g, "[字]")
        .replace(/\uE184/g, "[解]")
        .replace(/\uE183/g, "[多]")
        .replace(/\uE180/g, "[デ]");

    return axios({
        url: process.env.GAS_URL,
        method: "POST",
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
        data: processedBody
    })
    .then(response => {
        console.log(`${new Date()}: posted.`);
        console.log(response.data);
        return response.data;
    })
    .catch(error => {
        console.log(error.response?.data || error.message);
        throw error;
    });
}
