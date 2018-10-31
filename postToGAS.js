'use strict'
require('dotenv').config({ PATH: __dirname + '/.env'});

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
                console.log(`${new Date()} Update has been sent.`);
            })
        } else {
            console.log(`${new Date()} No Update`);
        }
    } else if (payload.dataType === "HDDInfoGet") {
        if (payload.remainVolumePercentage < 10) {
            request(options, function (error, response, body) {
                if(error) { console.log(error)};
                console.log(`${new Date()} HDD Information has been sent.`);
            })
        } else {
            console.log(`${new Date()} HDD capacity ${payload.remainVolumePercentage}%`);
        }
    } else {
        console.log("error: dataType didn't match");
    }
};
