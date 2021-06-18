const _data = require("../lib/data");
const helpers = require("../lib/helpers");
const tokensHandler = require("./tokens");
const util = require("util");
var debug = util.debuglog("carts");

// Contains private method to cart
const _carts = {};

// Private Method
// Fetch ttems detail for cart items
_carts.getItemsDetailForCartItems = (cartItems, callback) => {
  let itemCount = 0;
  const itemsDetail = [];
  const itemIds = Object.keys(cartItems);
  if (itemIds.length > 0) {
    itemIds.map((itemId) => {
      _data.read("items", itemId, function (err, itemData) {
        itemCount++;
        if (!err) {
          let itemDetail = {
            ...itemData,
            quantity: cartItems[itemId]
          };
          itemsDetail.push(itemDetail);
        } else {
          console.log(`Error reading item with id : ${itemId}`);
        }
        if (itemCount === itemIds.length) {
          callback(itemsDetail);
        }
      });
    });
  } else {
    callback([]);
  }

};

// POST
// Required: itemId, quantity
// Optional: none
_carts.post = function (requestData, callback) {
  const itemId =
    typeof requestData.payload.itemId === "string" &&
      requestData.payload.itemId.length === 10 ?
      requestData.payload.itemId :
      false;

  const quantity =
    typeof requestData.payload.quantity === "number" &&
      requestData.payload.quantity > 0 &&
      requestData.payload.quantity <= 10 &&
      requestData.payload.quantity % 1 === 0 ?
      requestData.payload.quantity :
      false;
  if (itemId && quantity) {
    const token = requestData.headers.token;
    tokensHandler.isTokenActive(token, function (isActive) {
      if (isActive) {
        _data.read("items", itemId, function (err, _itemsData) {
          if (!err) {
            _data.read("tokens", token, function (err, tokenData) {
              if (!err) {
                const email = tokenData.email;
                const emailKey = helpers.getEmailKey(email);
                _data.read("users", emailKey, function (err, userData) {
                  if (!err) {
                    let cartId = userData.cartId;
                    if (!cartId) {
                      cartId = helpers.createRandomString(15);
                      const cartData = {
                        cartItems: {
                          [itemId]: quantity,
                        },
                        created_Date: Date.now(),
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
                                _carts.getItemsDetailForCartItems({
                                  [itemId]: quantity
                                },
                                  (itemsDetail) => {
                                    callback(200, itemsDetail);
                                  }
                                );
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
                          callback(500, {
                            Error: "Internal Server Error"
                          });
                        }
                      });
                    } else {
                      _data.read("carts", cartId, function (err, cartData) {
                        if (!err && cartData) {
                          let updatedCartData = {
                            ...cartData,
                            cartItems: {
                              ...cartData.cartItems,
                              [itemId]: quantity,
                            },
                          };
                          _data.update(
                            "carts",
                            cartId,
                            updatedCartData,
                            function (err) {
                              if (!err) {
                                _carts.getItemsDetailForCartItems(
                                  updatedCartData.cartItems,
                                  (itemsDetail) => {
                                    callback(200, itemsDetail);
                                  }
                                );
                              } else {
                                debug(
                                  `Error updating the cart with id ${cartId} for user ${emailKey}`
                                );
                                callback(500, {
                                  Error: "Internal Server Error",
                                });
                              }
                            }
                          );
                        } else {
                          debug(`Error reading from cart ${cartId}`);
                          callback(500, {
                            Error: "Internal Server error"
                          });
                        }
                      });
                    }
                  } else {
                    debug(`Error fetching user ${email}`);
                    callback(500, {
                      Error: "Internal Server Error"
                    });
                  }
                });
              } else {
                debug(`Error fetching token ${token}`);
                callback(500, {
                  Error: "Internal Server Error"
                });
              }
            });
          } else {
            callback(400, {
              Error: "Item doen't exist"
            });
          }
        });
      } else {
        callback(403, "Not Autorized");
      }
    });
  } else {
    callback(400, {
      Error: "Missing required inputs, or inputs are invalid"
    });
  }
};

// GET
// Required: none
// Optional: none
_carts.get = function (requestData, callback) {
  const token = requestData.headers.token;
  tokensHandler.isTokenActive(token, function (isActive) {
    if (isActive) {
      _data.read("tokens", token, function (err, tokenData) {
        if (!err) {
          const email = tokenData.email;
          const emailKey = helpers.getEmailKey(email);
          _data.read("users", emailKey, function (err, userData) {
            if (!err) {
              let cartId = userData.cartId;
              if (cartId) {
                _data.read("carts", cartId, function (err, cartData) {
                  if (!err) {
                    _carts.getItemsDetailForCartItems(
                      cartData.cartItems,
                      (itemsDetail) => {
                        callback(200, itemsDetail);
                      }
                    );
                  } else {
                    debug(`Error reading from cart ${cartId}`);
                    callback(500, {
                      Error: "Internal Server error"
                    });
                  }
                });
              } else {
                callback(200, []);
              }
            } else {
              debug(`Error fetching user ${email}`);
              callback(500, {
                Error: "Internal Server Error"
              });
            }
          });
        } else {
          debug(`Error fetching token ${token}`);
          callback(500, {
            Error: "Internal Server Error"
          });
        }
      });
    } else {
      callback(403, { Error: "Not Autorized" });
    }
  });
};

// DELETE
// Required: none
// Optional: itemIds, deleteAll(At least one must be specified)
_carts.delete = function (requestData, callback) {
  const deleteAll =
    typeof requestData.payload.deleteAll === "boolean" ?
      requestData.payload.deleteAll :
      false;
  const itemIds =
    typeof requestData.payload.itemIds === "object" &&
      requestData.payload.itemIds.length &&
      requestData.payload.itemIds.length > 0 ?
      requestData.payload.itemIds :
      false;
  if (deleteAll || itemIds) {
    const token = requestData.headers.token;
    tokensHandler.isTokenActive(token, function (isActive) {
      if (isActive) {
        _data.read("tokens", token, function (err, tokenData) {
          if (!err) {
            const email = tokenData.email;
            const emailKey = helpers.getEmailKey(email);
            _data.read("users", emailKey, function (err, userData) {
              if (!err) {
                let cartId = userData.cartId;
                if (cartId) {
                  if (deleteAll) {
                    _data.delete("carts", cartId, function (err) {
                      if (!err) {
                        delete userData.cartId;
                        _data.update(
                          "users",
                          emailKey,
                          userData,
                          function (err) {
                            if (!err) {
                              callback(200, []);
                            } else {
                              debug(
                                `Error updating user with id ${userData.email}`
                              );
                              callback(500, {
                                Error: "Internal server error"
                              });
                            }
                          }
                        );
                      } else {
                        debug(`Error fetching cart with id ${cartId}`);
                        callback(500, {
                          Error: "Internal Server error"
                        });
                      }
                    });
                  } else {
                    _data.read("carts", cartId, function (err, cartData) {
                      if (!err) {
                        const {
                          cartItems
                        } = cartData;
                        const updatedCartItems = itemIds.reduce(
                          (cartItems, itemIdToDelete) => {
                            delete cartItems[itemIdToDelete];
                            return cartItems;
                          },
                          cartItems
                        );
                        const updatedCartData = { ...cartData, cartItems: updatedCartItems };
                        _data.update("carts", cartId, updatedCartData, function (err) {
                          if (!err) {
                            _carts.getItemsDetailForCartItems(
                              updatedCartItems,
                              (itemsDetail) => {
                                callback(200, itemsDetail);
                              }
                            );
                          } else {
                            debug(`Error updating cart ${cartId}`);
                            callback(500, {
                              Error: "Internal Server error"
                            });
                          }
                        })

                      } else {
                        debug(`Error reading from cart ${cartId}`);
                        callback(500, {
                          Error: "Internal Server error"
                        });
                      }
                    });
                  }
                } else {
                  callback(400, {
                    Error: "No item in the cart to delete"
                  });
                }
              } else {
                debug(`Error fetching user ${email}`);
                callback(500, {
                  Error: "Internal Server Error"
                });
              }
            });
          } else {
            debug(`Error fetching token ${token}`);
            callback(500, {
              Error: "Internal Server Error"
            });
          }
        });
      } else {
        callback(403, "Not Autorized");
      }
    });
  } else {
    callback(400, {
      Error: "Missing required inputs, or inputs are invalid"
    });
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
