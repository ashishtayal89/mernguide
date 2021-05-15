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

  // Get the header
  var header = req.headers;

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

    // Enable CORS for all incoming request and allow custom headers
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept,customheader"
    });

    // Send the response back to client
    res.end("Hello World\n");

    // Log the request path
    console.log(
      "Request Path :",
      trimmedPath,
      " \nMethod : " + method,
      " \nQuery String : ",
      { ...queryStringObject },
      " \nHeaders : ",
      header,
      " \nData : ",
      buffer
    );
  });

  // Send the response
});

// Start the server and have it listen at port 3000
server.listen(3000, function() {
  console.log("Server listning at localhost:3000");
});
