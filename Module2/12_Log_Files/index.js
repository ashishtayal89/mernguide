const server = require('./lib/server');
const worker = require("./lib/workers");

const app = {};

app.init = function () {
  // Start the servers
  server.init();

  // Start the background worker
  worker.init();
}

app.init();

module.exports = app;