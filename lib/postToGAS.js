'use strict'

const request = require('request');

module.exports = function postToGAS(payload) {
    if (!payload) {
        throw new Error("引数がありません");
    }
    payload.token = process.env.TOKEN; // GASのアクセストークン
    if (payload.endpoint === "titleListGet") {
        const options = {
            uri: process.env.GAS_URL,
            method: "POST",
            timeout: 60000,
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
            console.log(`${new Date()} Nasneの録画リストをGoogle Apps Scriptに送信しました.`);
            return;
        })
    } else if (payload.endpoint === "HDDInfoGet") {
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
                console.log(`${new Date()} HDD情報をGoogle Apps Scriptに送信しました.`);
            })
        } else {
            console.log(`${new Date()} HDD capacity ${payload.body.HDD.remainVolumePercentage}%`);
        }
    } else {
        throw new Error("endpoint が不正です.");
    }
};