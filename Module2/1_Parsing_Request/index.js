const http = require("http");
const url = require("url");

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

  // Send the response
  res.end("Hello World\n");

  // Log the request path
  console.log(
    "Request Path :",
    trimmedPath,
    " \nMethod : " + method,
    " \nQuery String : ",
    { ...queryStringObject },
    " \nHeaders : ",
    header
  );
});

// Start the server and have it listen at port 3000
server.listen(3000, function() {
  console.log("Server listning at localhost:3000");
});
