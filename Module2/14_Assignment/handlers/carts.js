const _data = require("../lib/data");
const helpers = require("../lib/helpers");
const tokensHandler = require("./tokens");
const util = require("util");
var debug = util.debuglog("carts");

// Contains private method to cart
const _carts = {};

// POST
// Required: itemId, quantity
// Optional: none
_carts.post = function (requestData, callback) {
  const itemId =
    typeof requestData.payload.itemId === "string" &&
    requestData.payload.itemId.length === 10
      ? requestData.payload.itemId
      : false;
  const quantity =
    typeof requestData.payload.quantity === "number" &&
    requestData.payload.quantity > 0 &&
    requestData.payload.quantity < 50 &&
    requestData.payload.quantity % 1 === 0
      ? requestData.payload.quantity
      : false;
  if (itemId && quantity) {
    _data.read("items", itemId, function (err, _itemsData) {
      if (!err) {
        const token = requestData.headers.token;
        tokensHandler.isTokenActive(token, function (isActive) {
          if (isActive) {
            _data.read("tokens", token, function (err, tokenData) {
              if (!err) {
                const email = tokenData.email;
                const emailKey = helpers.getEmailKey(email);
                _data.read("users", emailKey, function (err, userData) {
                  if (!err) {
                    if (!userData.cartId) {
                      const cartId = helpers.createRandomString(15);
                      const cartData = {
                        cartItems: {
                          [itemId]: quantity,
                        },
                        email,
                      };
                      _data.create("carts", cartId, cartData, function (err) {
                        if (!err) {
                          userData.cartId = cartId;
                          _data.update(
                            "users",
                            emailKey,
                            userData,
                            function (err) {
                              if (!err) {
                                callback(200, { cartId });
                              } else {
                                debug(
                                  `Error updating user ${emailKey} with cartId ${cartId}`
                                );
                                callback(500, {
                                  Error: "Internal Server Error",
                                });
                              }
                            }
                          );
                        } else {
                          debug(
                            `Error creating new cart with cartId ${cartId} for user ${emailKey}`
                          );
                          callback(500, { Error: "Internal Server Error" });
                        }
                      });
                    } else {
                      callback(400, { Error: "Cart already exits" });
                    }
                  } else {
                    debug(`Error fetching user ${email}`);
                    callback(500, { Error: "Internal Server Error" });
                  }
                });
              } else {
                debug(`Error fetching token ${token}`);
                callback(500, { Error: "Internal Server Error" });
              }
            });
          } else {
            callback(403, "Not Autorized");
          }
        });
      } else {
        callback(400, { Error: "Item doen't exist" });
      }
    });
  } else {
    callback(400, { Error: "Missing required inputs, or inputs are invalid" });
  }
};

// GET
// Required: id
// Optional: none
_carts.get = function (requestData, callback) {
  const cartId =
    typeof requestData.queryStringObject.id === "string" &&
    requestData.queryStringObject.id.length === 15
      ? requestData.queryStringObject.id
      : false;
  if (cartId) {
    const token = requestData.headers.token;
    _data.read("carts", cartId, function (err, cartData) {
      if (!err) {
        tokensHandler.isTokenAuthentic(
          token,
          cartData.email,
          function (isAuthentic) {
            if (isAuthentic) {
              let { cartItems } = cartData;
              const finalCartItems = [];
              const totalItemsCount = Object.keys(cartItems).length;
              let currentItemCount = 0;
              for (let itemId in cartItems) {
                currentItemCount++;
                _data.read("items", itemId, function (err, itemData) {
                  if (!err) {
                    finalCartItems.push({
                      ...itemData,
                      quantity: cartItems[itemId],
                    });
                    if (currentItemCount === totalItemsCount) {
                      callback(200, finalCartItems);
                    }
                  } else {
                    debug(`Error fetching item ${itemId}`);
                  }
                });
              }
            } else {
              callback(403, { Error: "Not Authorized" });
            }
          }
        );
      } else {
        debug(`Error reading from cart ${cartId}`);
        callback(500, { Error: "Internal Server Error" });
      }
    });
  } else {
    callback(400, { Error: "Invalid cart Id" });
  }
};

// PUT
// Required: id
// Optional: itemId, quantity
_carts.put = function (requestData, callback) {};

// DELETE
// Required: id
// Optional: none
_carts.delete = function (requestData, callback) {};

// Cart
module.exports.default = function (requestData, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(requestData.method) > -1) {
    _carts[requestData.method](requestData, callback);
  } else {
    callback(405);
  }
};
