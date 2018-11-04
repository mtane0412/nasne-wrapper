'use strict'
require('dotenv').config({ path: __dirname + '/.env' });
const request = require('request-promise');

module.exports = function postToGAS(payload) {
    if (payload.dataType === "titleListGet") {
        if (payload.newVideo) {
            const options = {
                uri: process.env.GAS_URL,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            };
            request(options, function (error, response, body) {
                if (error) { throw error; }
                console.log(`${new Date()} Update has been sent.`);
            })
        } else {
            console.log(`${new Date()} No Update`);
        }
    } else if (payload.dataType === "HDDInfoGet") {
        if (payload.remainVolumePercentage < 10) {
            request(options, function (error, response, body) {
                if (error) { throw error };
                console.log(`${new Date()} HDD Information has been sent.`);
            })
        } else {
            console.log(`${new Date()} HDD capacity ${payload.remainVolumePercentage}%`);
        }
    } else {
        console.log("error: dataType didn't match");
    }
};
