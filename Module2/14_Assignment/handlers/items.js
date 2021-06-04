// Dependencies
var _data = require("../lib/data");
const tokensHandler = require("./tokens");

// Contains private methods for items
const _items = {};

// MenuItems - Get
// Required data : none
// Optional data : none
_items.get = function (data, callback) {
  const token = data.headers.token;
  // Check if token exist in the request
  if (token) {
    // Check if the token is active or expired
    tokensHandler.isTokenActive(token, function (isTokenActive) {
      if (isTokenActive) {
        _data.list("items", function (err, productIds) {
          if (!err) {
            if (productIds && productIds.length > 0) {
              const notFetchProductIds = [];
              const fetchedProducts = [];
              for (const productId of productIds) {
                _data.read("items", productId, function (err, product) {
                  if (!err) {
                    fetchedProducts.push(product);
                  } else {
                    notFetchProductIds.push(productId);
                  }
                  if (
                    productIds.length ===
                    fetchedProducts.length + notFetchProductIds.length
                  ) {
                    if (notFetchProductIds.length > 0) {
                      console.log(
                        `Error fetching these products or products don't exist \n Product Ids : ${notFetchProductIds}`
                      );
                    }
                    if (fetchedProducts.length > 0) {
                      callback(200, fetchedProducts);
                    } else {
                      callback(500, "Error fetching products");
                    }
                  }
                });
              }
            } else {
              callback(200, "There is no product");
            }
          } else {
            callback(500, "Error fetching products");
          }
        });
      } else {
        callback(401, "The session has timed out");
      }
    });
  } else {
    callback(401, "Please login to the application");
  }
};

// Items
module.exports.default = function (data, callback) {
  var acceptableMethods = ["get"];
  if (acceptableMethods.indexOf(data.method) > -1 && _items[data.method]) {
    _items[data.method](data, callback);
  } else {
    callback(405);
  }
};
