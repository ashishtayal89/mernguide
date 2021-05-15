const http = require("http");

const server = http.createServer(function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.end("Hello World");
});

server.listen(3000);

console.log("Server running at port 3000");
