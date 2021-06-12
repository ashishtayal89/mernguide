const users = require("./users").default;
const tokens = require("./tokens").default;
const items = require("./items").default;
const carts = require("./carts").default;
const static = require("./static").default;
const orders = require("./orders").default;

const ping = function (_data, callback) {
  callback(200);
};

module.exports = {
  ping,
  users,
  tokens,
  items,
  carts,
  orders,
  static
};
