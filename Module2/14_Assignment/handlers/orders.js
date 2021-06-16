// Dependencies
const helpers = require("../lib/helpers");
const _data = require("../lib/data");
const tokensHandler = require("./tokens");
const util = require("util");
var debug = util.debuglog("orders");


STRIPE_SECRET_KEY = "sk_test_PGqotvlolbS4OvAhTsZWJAS300ee2jy9sU";

// Contains private methods for orders
const _orders = {};

// Test card to create order
// 4242 4242 4242 4242
// 4000 0025 0000 3155
// 4000 0000 0000 9995


// Orders - Get
// Required data : none
// Optional data : none
_orders.get = function (data, callback) {
};

// Orders - Post
// Required data : paymentMethodId
// Optional data : none
_orders.post = function (data, callback) {
    let clientAmount = typeof data.payload.amount === "number" && data.payload.amount > 0 ? parseInt(data.payload.amount) : false;
    let paymentMethodId = typeof data.payload.paymentMethodId === "string" ? data.payload.paymentMethodId : false;
    if (paymentMethodId && clientAmount) {
        const token = data.headers.token;
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
                                            const { cartItems } = cartData;
                                            let itemCount = 0;
                                            let serverAmount = 0;
                                            let cartItemsData = [];
                                            for (let itemId in cartItems) {
                                                _data.read("items", itemId, function (err, itemData) {
                                                    itemCount++
                                                    if (!err) {
                                                        serverAmount += itemData.price * cartItems[itemId];
                                                        cartItemsData.push({ ...itemData, quantity: cartItems[itemId] })
                                                    }
                                                    else {
                                                        debug(`Error reading item with id ${itemId}`);
                                                    }
                                                    if (itemCount === Object.keys(cartItems).length) {
                                                        serverAmount = parseInt(serverAmount);
                                                        if (serverAmount === clientAmount) {
                                                            helpers.stripePayment({ amount: serverAmount, paymentMethodId }, function (err, response) {
                                                                if (!err) {
                                                                    const { statusCode, status, clientSecret, requiresAction } = response;
                                                                    if (statusCode === 200 && status === "succeeded") {
                                                                        const orderId = helpers.createRandomString(11);
                                                                        const orderData = {
                                                                            id: orderId,
                                                                            items: cartItemsData,
                                                                            created: Date.now(),
                                                                            totalAmount: serverAmount
                                                                        };
                                                                        _data.create("Orders", orderId, orderData, function (err) {
                                                                            if (!err) {
                                                                                callback(200, { clientSecret, requiresAction });
                                                                                _data.delete("Carts", cartId, function (err) {
                                                                                    if (err) {
                                                                                        debug(`Cart could not be deleted for order ${orderId} and cart ${cartId}`);
                                                                                    } else {
                                                                                        delete userData["cartId"];
                                                                                        _data.update("users", emailKey, userData, function (err) {
                                                                                            debug(`Cart could not be unliked from user ${emailKey} for order ${orderId}`);
                                                                                        })
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                debug(`Order could not be placed for order ${orderId}`);
                                                                                callback(500, { Error: "Order could not be placed, the debited amount will be credited back in 24 hours" });
                                                                            }
                                                                        })

                                                                    } else {
                                                                        callback(statusCode, { Error: "Card details are not valid" });
                                                                    }
                                                                } else {
                                                                    debug(`Error placing an order for cart ${cartId}`);
                                                                    callback(500, { Error: "Internal Server Error" });
                                                                }
                                                            })
                                                        } else {
                                                            callback(400, { Error: "Amount doesn't match the total amount of the cart" })
                                                        }
                                                    }
                                                });

                                            }
                                        } else {
                                            debug(`Error reading from cart ${cartId} `);
                                            callback(500, {
                                                Error: "Internal Server error"
                                            });
                                        }
                                    });
                                } else {
                                    callback(400, {
                                        Error: "No item in the cart to delete"
                                    });
                                }
                            } else {
                                debug(`Error fetching user ${email} `);
                                callback(500, {
                                    Error: "Internal Server Error"
                                });
                            }
                        });
                    } else {
                        debug(`Error fetching token ${token} `);
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
        callback(400, { Error: "Missing fields in payment request" });
    }
};

// Orders
module.exports.default = function (data, callback) {
    var acceptableMethods = ["get", "post"];
    if (acceptableMethods.indexOf(data.method) > -1 && _orders[data.method]) {
        _orders[data.method](data, callback);
    } else {
        callback(405);
    }
};