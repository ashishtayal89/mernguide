// Dependencies
var _data = require("../lib/data");
var helpers = require("../lib/helpers");

// Container for private token methods
_tokens = {};

// Tokens - post
// Required data: email, password
// Optional data: none
_tokens.post = function (data, callback) {
  var email = data.payload.email;
  var emailKey = typeof email == "string" && helpers.getEmailKey(email);
  var password =
    typeof data.payload.password == "string" &&
      data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  if (emailKey && password) {
    // Lookup the user who matches that emailKey
    _data.read("users", emailKey, function (err, userData) {
      if (!err && userData) {
        // Hash the sent password, and compare it to the password stored in the user object
        var hashedPassword = helpers.hash(password);
        if (hashedPassword == userData.hashedPassword) {
          // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
          var tokenId = helpers.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenObject = {
            email: email,
            id: tokenId,
            expires: expires,
          };

          // Store the token
          _data.create("tokens", tokenId, tokenObject, function (err) {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: "Could not create the new token" });
            }
          });
        } else {
          callback(400, {
            Error:
              "Password did not match the specified user's stored password",
          });
        }
      } else {
        callback(400, { Error: "Could not find the specified user." });
      }
    });
  } else {
    callback(400, { Error: "Missing required field(s)." });
  }
};

// Tokens - get
// Required data: id
// Optional data: none
_tokens.get = function (data, callback) {
  // Check that id is valid
  var id =
    typeof data.queryStringObject.id == "string" &&
      data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  isTokenActive(id, function (isActive) {
    if (isActive) {
      if (id) {
        // Lookup the token
        _data.read("tokens", id, function (err, tokenData) {
          if (!err && tokenData) {
            callback(200, tokenData);
          } else {
            callback(404);
          }
        });
      } else {
        callback(400, { Error: "Missing required field, or field invalid" });
      }
    } else {
      callback(403, { Error: "Not autherized" });
    }
  })

};

// Tokens - put
// Required data: id, extend
// Optional data: none
_tokens.put = function (data, callback) {
  var id =
    typeof data.payload.id == "string" && data.payload.id.trim().length == 20
      ? data.payload.id.trim()
      : false;
  var extend =
    typeof data.payload.extend == "boolean" && data.payload.extend == true
      ? true
      : false;
  if (id && extend) {
    // Lookup the existing token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        // Check to make sure the token isn't already expired
        if (tokenData.expires > Date.now()) {
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          // Store the new updates
          _data.update("tokens", id, tokenData, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, {
                Error: "Could not update the token's expiration.",
              });
            }
          });
        } else {
          callback(400, {
            Error: "The token has already expired, and cannot be extended.",
          });
        }
      } else {
        callback(400, { Error: "Specified user does not exist." });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required field(s) or field(s) are invalid.",
    });
  }
};

// Tokens - delete
// Required data: id
// Optional data: none
_tokens.delete = function (data, callback) {
  // Check that id is valid
  var id =
    typeof data.queryStringObject.id == "string" &&
      data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        // Delete the token
        _data.delete("tokens", id, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "Could not delete the specified token" });
          }
        });
      } else {
        callback(400, { Error: "Could not find the specified token." });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Tokens
module.exports.default = function (data, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Verify if the token is still active
function isTokenActive(id, callback) {
  _data.read("tokens", id, function (err, tokenData) {
    if (!err) {
      if (tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      console.log(
        `Could not read token or token doesn't exit. TOKEN ID : ${id}`
      );
      callback(false);
    }
  });
};
module.exports.isTokenActive = isTokenActive;

// Verify if a given token id is currently valid for a given user
function isTokenAuthentic(id, email, callback) {
  // Lookup the token
  _data.read("tokens", id, function (err, tokenData) {
    if (!err && tokenData) {
      // Check that the token is for the given user and has not expired
      if (tokenData.email == email && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};
module.exports.isTokenAuthentic = isTokenAuthentic;
