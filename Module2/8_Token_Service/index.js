const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./lib/config");
const fs = require("fs");
const handlers = require("./lib/handlers");
const helpers = require("./lib/helpers");

// Instantiate HTTP server
const httpServer = http.createServer(function(req, res) {
  // Common handler to handle both http and https request
  unifiedServer(req, res);
});

// Start the HTTP server and have it listen on a http PORT
httpServer.listen(config.httpPort, function() {
  console.log(`HTTP SERVER : Listning at localhost:${config.httpPort}`);
});

// Instantiate HTTPS server
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};

const httpsServer = https.createServer(httpsServerOptions, function(req, res) {
  unifiedServer(req, res);
});

// Start the HTTPa server and have it listen on a http PORT
httpsServer.listen(config.httpsPort, function() {
  console.log(`HTTPS SERVER : Listning at localhost:${config.httpsPort}`);
});

// Server logic for both http and https request
const unifiedServer = function(req, res) {
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
  req.on("data", function(data) {
    buffer += decoder.write(data);
  });

  // Event triggerd when the request is complete
  req.on("end", function() {
    buffer += decoder.end();

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer)
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
        typeof router[trimmedPath] != `undefined`
          ? router[trimmedPath]
          : handlers.notFound;

      // Route the request to data specified in the handler
      chosenHandler(data, function(statusCode, payload) {
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

        // Log the request path
        console.log(
          "Status Code :",
          statusCode,
          " \nPayload : ",
          payloadString
        );
      });
    }
  });
};

// Creating router
const router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens
};