const server = require("./lib/server");

const app = {};

app.init = function () {
  // Start the servers
  server.init();
};

app.init();

module.exports = app;
