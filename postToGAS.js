'use strict'
require('dotenv').config({ PATH: __dirname + '/.env'});

module.exports = function postToGAS(result) {
    if (result.newVideo) {
        const options = {
            uri: process.env.GAS_URL,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result)
        };
        request(options, function (error, response, body) {
            console.log(`${new Date()} Update has been sent.`);
        })
    } else {
        console.log(`${new Date()} No Update`);
    }
};
