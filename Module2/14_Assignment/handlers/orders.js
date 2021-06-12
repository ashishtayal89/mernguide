// Dependencies
const queristring = require("querystring");
const https = require("https");
const _data = require("../lib/data");
const tokensHandler = require("./tokens");


STRIPE_SECRET_KEY = "sk_test_PGqotvlolbS4OvAhTsZWJAS300ee2jy9sU";

const flattenObject = (object) => {
    let flattendObj = {};
    const flatten = (obj, keyName) => {
        Object.keys(obj).forEach(key => {
            var newKey = keyName ? `${keyName}[${key}]` : key;
            if (typeof obj[key] === "object") {
                // calling the function again
                flatten(obj[key], newKey);
            } else {
                flattendObj[newKey] = obj[key];
            }
        });
        return flattendObj;
    };
    return flatten(object);
}

// Contains private methods for orders
const _orders = {};

// Orders - Get
// Required data : none
// Optional data : none
_orders.get = function (data, callback) {
};

// Orders - Post
// Required data : paymentMethodId
// Optional data : none
_orders.post = function (data, callback) {
    const { paymentMethodId } = data.payload;

    const amount = 500;
    const currency = "USD";

    const stringPayload = queristring.stringify(flattenObject({
        amount,
        currency,
        description: "Software development services",
        shipping: {
            name: "Jenny Rosen",
            address: {
                line1: "510 Townsend St",
                postal_code: "98140",
                city: "San Francisco",
                state: "CA",
                country: "US",
            },
        },
        payment_method: paymentMethodId,
        confirmation_method: "manual",
        confirm: true,
    }));

    // Configure the request details
    var requestDetails = {
        host: "api.stripe.com",
        port: "443",
        path: "/v1/payment_intents",
        method: "POST",
        headers: {
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(stringPayload),
        },
    };

    try {
        const apiReq = https.request(requestDetails);

        apiReq.on('response', (apiRes) => {
            console.log("Response");
            let response = '';

            apiRes.setEncoding('utf8');
            apiRes.on('data', (chunk) => {
                response += chunk;
            });

            apiRes.on('end', () => {
                console.log("Response end");
                const statusCode = apiRes.statusCode;
                const payload = JSON.parse(response);
                const clientSecret = payload.client_secret;
                const status = payload.status;
                if (statusCode === 200 && status === "succeeded") {
                    callback(200, { clientSecret })
                } else {
                    callback(400, payload)
                }
            });
        })

        apiReq.on('error', (error) => {
            console.log(error);
        });

        apiReq.write(stringPayload);
        apiReq.end();

    } catch (err) {
        console.log(err);
    }
};

// Orders
module.exports.default = function (data, callback) {
    var acceptableMethods = ["get", "post"];
    if (acceptableMethods.indexOf(data.method) > -1 && _orders[data.method]) {
        _orders[data.method](data, callback);
    } else {
        callback(405);
    }
};