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
                _data.read("items", itemId, function (err, itemData) {
                  currentItemCount++;
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
        callback(400, { Error: "Cart doesn't exit with this id" });
      }
    });
  } else {
    callback(400, { Error: "Invalid cart Id" });
  }
};

// PUT
// Required: id, itemId, quantity
// Optional: none
_carts.put = function (requestData, callback) {
  const cartId =
    typeof requestData.payload.id === "string" &&
    requestData.payload.id.length === 15
      ? requestData.payload.id
      : false;
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
  if (cartId && itemId && quantity) {
    const token = requestData.headers.token;
    _data.read("carts", cartId, function (err, cartData) {
      if (!err) {
        tokensHandler.isTokenAuthentic(
          token,
          cartData.email,
          function (isAuthentic) {
            if (isAuthentic) {
              _data.read("items", itemId, function (err, _itemsData) {
                if (!err) {
                  let { cartItems } = cartData;
                  if (quantity === 0) {
                    delete cartItems[itemId];
                  } else {
                    cartItems = { ...cartData.cartItems, [itemId]: quantity };
                  }
                  cartData = {
                    ...cartData,
                    cartItems,
                  };
                  _data.update("carts", cartId, cartData, function (err) {
                    if (!err) {
                      let { cartItems } = cartData;
                      const finalCartItems = [];
                      const totalItemsCount = Object.keys(cartItems).length;
                      let currentItemCount = 0;
                      for (let itemId in cartItems) {
                        _data.read("items", itemId, function (err, itemData) {
                          currentItemCount++;
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
                      debug(`Error updating the cart with id ${cartId}`);
                      callback(500, { Error: "Internal Server Error" });
                    }
                  });
                } else {
                  callback(400, { Error: "Item doen't exist" });
                }
              });
            } else {
              callback(403, { Error: "Not Authorized" });
            }
          }
        );
      } else {
        debug(`Error reading from cart ${cartId}`);
        callback(400, { Error: "Cart doesn't exit with this id" });
      }
    });
  } else {
    callback(400, { Error: "Invalid or missing fields id, itemId, quantity" });
  }
};

// DELETE
// Required: id
// Optional: none
_carts.delete = function (requestData, callback) {
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
              _data.delete("carts", cartId, function (err) {
                if (!err) {
                  const emailKey = helpers.getEmailKey(cartData.email);
                  _data.read("users", emailKey, function (err, userData) {
                    if (!err) {
                      const { cartId, ...userDataWithoutCart } = userData;
                      _data.update(
                        "users",
                        emailKey,
                        userDataWithoutCart,
                        function (err) {
                          if (!err) {
                            callback(200);
                          } else {
                            debug(
                              `Error updating user with id ${cartData.email}`
                            );
                            callback(500, {
                              Error: "Internal Server Error",
                            });
                          }
                        }
                      );
                    } else {
                      debug(`Error reading user with id ${cartData.email}`);
                      callback(500, {
                        Error: "Internal Server Error",
                      });
                    }
                  });
                } else {
                  debug(`Error deleting cart with id ${cartId}`);
                  callback(500, { Error: "Internal Server Error" });
                }
              });
            } else {
              callback(403, { Error: "Not Authorized" });
            }
          }
        );
      } else {
        debug(`Error reading from cart ${cartId}`);
        callback(500, { Error: "Cart doesn't exit with this id" });
      }
    });
  } else {
    callback(400, { Error: "Invalid cart Id" });
  }
};

// Cart
module.exports.default = function (requestData, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(requestData.method) > -1) {
    _carts[requestData.method](requestData, callback);
  } else {
    callback(405);
  }
};
