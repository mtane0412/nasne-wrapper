'use strict'
require('dotenv').config({
    path: __dirname + '/.env'
});
const request = require('request-promise');

module.exports = function postToGAS(payload) {
    payload.token = process.env.TOKEN; // GASのアクセストークン
    if (payload.dataType === "titleListGet") {
        if (payload.body.newVideo) {
            const options = {
                uri: process.env.GAS_URL,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
                    .replace(/\ue195/g, "[終]")
                    .replace(/\ue193/g, "[新]")
                    .replace(/\ue0fe/g, "[字]")
                    .replace(/\uE184/g, "[解]")
                    .replace(/\uE183/g, "[多]")
                    .replace(/\uE180/g, "[デ]")
            };
            request(options, function (error, response, body) {
                if (error) {
                    throw error;
                }
                console.log(`${new Date()} Update has been sent.`);
            })
        } else {
            console.log(`${new Date()} No Update`);
        }
    } else if (payload.dataType === "HDDInfoGet") {
        // GBに変換
        payload.body.HDD.usedVolumeSize = Math.round(payload.body.HDD.usedVolumeSize / 1073741824);
        payload.body.HDD.freeVolumeSize = Math.round(payload.body.HDD.freeVolumeSize / 1073741824);
        payload.body.HDD.totalVolumeSize = Math.round(payload.body.HDD.totalVolumeSize / 1073741824);

        // 残りHDD容量(%)
        payload.body.HDD.remainVolumePercentage = Math.round(payload.body.HDD.freeVolumeSize / payload.body.HDD.totalVolumeSize * 100);

        if (payload.body.HDD.remainVolumePercentage < 10) {
            request(options, function (error, response, body) {
                if (error) {
                    throw error
                };
                console.log(`${new Date()} HDD Information has been sent.`);
            })
        } else {
            console.log(`${new Date()} HDD capacity ${payload.body.HDD.remainVolumePercentage}%`);
        }
    } else {
        console.log("error: dataType didn't match");
    }
};