const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const fs = require("fs");
const path = require("path");
const config = require("../lib/config");
const handlers = require("../handlers");
const helpers = require("../lib/helpers");
var util = require("util");
var debug = util.debuglog("server");

// Instatiate the server
const server = {};

// Instantiate HTTP server
server.httpServer = http.createServer(function (req, res) {
  // Common handler to handle both http and https request
  server.unifiedServer(req, res);
});

// Instantiate HTTPS server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem")),
};

server.httpsServer = https.createServer(
  server.httpsServerOptions,
  function (req, res) {
    server.unifiedServer(req, res);
  }
);

// Server logic for both http and https request
server.unifiedServer = function (req, res) {
  // Get the URL and parse it
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //Get request method
  var method = req.method.toLowerCase();

  //Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the headers
  var headers = req.headers;

  // Get the payload/data
  var buffer = "";
  var decoder = new StringDecoder("utf-8");

  // Event trigger evertime a stream of data is recieved
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });

  // Event triggerd when the request is complete
  req.on("end", function () {
    buffer += decoder.end();

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    };
    // Set Origin to enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Allow customheader
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, customheader, token"
    );
    // Allow all request methods ie get post put delete
    res.setHeader("Access-Control-Allow-Methods", "*");

    if (method === "options") {
      res.end();
    } else {
      // Choose the handler this request should go to.
      const chosenHandler =
        server.router[trimmedPath] || server.router['static'];


      // Route the request to data specified in the handler
      chosenHandler(data, function (statusCode, payload, isStatic) {
        if (isStatic) {

          // Set the status code
          res.writeHeader(statusCode);

          // Send the static response back to client
          res.end(payload);
        } else {
          statusCode = typeof statusCode === "number" ? statusCode : 200;

          payload = typeof payload === "object" ? payload : {};

          // Convert the payload to a string
          var payloadString = JSON.stringify(payload);

          // Set the response as JSON
          res.setHeader("Content-Type", "application/json");

          // Set the status code
          res.writeHeader(statusCode);

          // Send the response back to client
          res.end(payloadString);
        }


        // If the response is 200, print green, otherwise print red
        if (statusCode == 200) {
          debug(
            "\x1b[32m%s\x1b[0m",
            method.toUpperCase() + " /" + trimmedPath + " " + statusCode
          );
        } else {
          debug(
            "\x1b[31m%s\x1b[0m",
            method.toUpperCase() + " /" + trimmedPath + " " + statusCode
          );
        }
      });
    }
  });
};

// Creating router
server.router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  carts: handlers.carts,
  items: handlers.items,
  orders: handlers.orders,
  static: handlers.static
};

server.init = function () {
  // Start the HTTP server
  server.httpServer.listen(config.httpPort, function () {
    console.log(
      "\x1b[36m%s\x1b[0m",
      "The HTTP server is running on port " + config.httpPort
    );
  });

  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, function () {
    console.log(
      "\x1b[35m%s\x1b[0m",
      "The HTTPS server is running on port " + config.httpsPort
    );
  });
};

module.exports = server;
