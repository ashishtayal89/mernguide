/*
 * Helpers for various tasks
 *
 */

// Dependencies
const queristring = require("querystring");
var config = require("./config");
var crypto = require("crypto");
var https = require("https");
var querystring = require("querystring");
var { EMAIL_VALIDATION, EMAIL_KEYS } = require("../constants");

// Container for all the helpers
var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function (str) {
  if (typeof str == "string" && str.length > 0) {
    var hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function (strLength) {
  strLength = typeof strLength == "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    // Define all the possible characters that could go into a string
    var possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

    // Start the final string
    var str = "";
    for (i = 1; i <= strLength; i++) {
      // Get a random charactert from the possibleCharacters string
      var randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      // Append this character to the string
      str += randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

helpers.sendTwilioSms = function (phone, msg, callback) {
  // Validate parameters
  phone =
    typeof phone == "string" && phone.trim().length == 10
      ? phone.trim()
      : false;
  msg =
    typeof msg == "string" && msg.trim().length > 0 && msg.trim().length <= 1600
      ? msg.trim()
      : false;
  if (phone && msg) {
    // Configure the request payload
    var payload = {
      From: config.twilio.fromPhone,
      To: "+91" + phone,
      Body: msg,
    };
    var stringPayload = querystring.stringify(payload);

    // Configure the request details
    var requestDetails = {
      protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path:
        "/2010-04-01/Accounts/" + config.twilio.accountSid + "/Messages.json",
      auth: config.twilio.accountSid + ":" + config.twilio.authToken,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object
    var req = https.request(requestDetails, function (res) {
      // Grab the status of the sent request
      var status = res.statusCode;
      // Callback successfully if the request went through
      if (status == 200 || status == 201) {
        callback(false);
      } else {
        callback("Status code returned was " + status);
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on("error", function (e) {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    callback("Given parameters were missing or invalid");
  }
};

// Checks if an email address is valid
helpers.isValidEmail = (email) => EMAIL_VALIDATION.test(email);

// Checks email address validity and returns email key
helpers.getEmailKey = (email) => {
  if (helpers.isValidEmail(email)) {
    var [name, domain] = email.split(EMAIL_KEYS);
    return `${domain.split(".").reverse().join("_")}_${name}`;
  }
  return false;
};

helpers.flattenObject = (object) => {
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


helpers.stripePayment = ({ amount, paymentMethodId }, callback) => {

  // Create the payload string
  const stringPayload = queristring.stringify(helpers.flattenObject({
    amount,
    currency: "USD",
    description: "Software development services",
    // This is a dummy shipping address
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
      Authorization: `Bearer ${config.stripeSecret}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(stringPayload),
    },
  };


  try {
    // Create the Api request
    const apiReq = https.request(requestDetails);

    // Configure response handler
    apiReq.on('response', (apiRes) => {
      let response = '';

      apiRes.setEncoding('utf8');
      apiRes.on('data', (chunk) => {
        response += chunk;
      });

      apiRes.on('end', () => {
        const payload = JSON.parse(response);
        const statusCode = apiRes.statusCode;
        const clientSecret = payload.client_secret;
        const requiresAction = payload.requiresAction;
        const status = payload.status;
        callback(false, { statusCode, status, clientSecret, requiresAction })
      });
    })

    // Configure error handler
    apiReq.on('error', (error) => {
      callback(true, error)
    });

    // Send request payload
    apiReq.write(stringPayload);

    // End request
    apiReq.end();

  } catch (error) {
    callback(true, error)
  }


}

// Export the module
module.exports = helpers;
