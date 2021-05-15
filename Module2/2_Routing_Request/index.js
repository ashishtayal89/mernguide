const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// Create a http server
const server = http.createServer(function(req, res) {
  // Get the URL and parse it
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //Get request method
  var method = req.method.toUpperCase();

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
      payload: buffer
    };
    req.ty;

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

      // Set statuscode 200 for OPTIONS request to handle CORS
      if (method === "OPTIONS") {
        statusCode = 200;
      }

      // Set the response as JSON
      res.setHeader("Content-Type", "application/json");

      // Set the response status code
      res.writeHead(statusCode, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept,customheader"
      });

      // Send the response back to client
      res.end(payloadString);

      // Log the request path
      console.log("Status Code :", statusCode, " \nPayload : ", payloadString);
    });
  });

  // Send the response
});

// Start the server and have it listen at port 3000
server.listen(3000, function() {
  console.log("Server listning at localhost:3000");
});

// Creating router and request handlers

const handlers = {
  sample: function(data, callback) {
    callback(406, { name: "Ashish" });
  },
  notFound: function(data, callback) {
    callback(404);
  }
};

const router = {
  sample: handlers.sample
};
