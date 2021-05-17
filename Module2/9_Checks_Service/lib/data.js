/**
 * Library for storing and editing data
 */

// Dependencies
const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

// Container for the module to be exported
const lib = {};

// Base path for the data folder
lib.basePath = path.join(__dirname, "/../.data/");

// Create a file and write data to it.
lib.create = function(dir, file, data, callback) {
  // Create the file for writing
  fs.open(`${lib.basePath}${dir}/${file}.json`, "wx", function(
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      // Convest data to string
      const stringData = JSON.stringify(data);

      // Write to file
      fs.writeFile(fileDescriptor, stringData, function(err) {
        if (!err) {
          // Close the file
          fs.close(fileDescriptor, function(err) {
            if (!err) {
              callback(false);
            } else {
              callback("Error closing new file");
            }
          });
        } else {
          callback("Error writing to new file");
        }
      });
    } else {
      callback("Could not create file, it already exists");
    }
  });
};

// Read data from a file
lib.read = function(dir, file, callback) {
  fs.readFile(`${lib.basePath}${dir}/${file}.json`, "utf8", function(
    err,
    data
  ) {
    if (!err && data) {
      var parsedData = helpers.parseJsonToObject(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  });
};

// Update the exiting file
lib.update = function(dir, file, data, callback) {
  fs.open(`${lib.basePath}${dir}/${file}.json`, "r+", function(
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.ftruncate(fileDescriptor, function(err) {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, function(err) {
            if (!err) {
              fs.close(fileDescriptor, function(err) {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error closing updated file");
                }
              });
            } else {
              callback("Error updating file");
            }
          });
        } else {
          callback("Error truncating file");
        }
      });
    } else {
      console.log("Error updating file, it may not be present");
    }
  });
};

// Delete a file
lib.delete = function(dir, file, callback) {
  fs.unlink(`${lib.basePath}${dir}/${file}.json`, function(err) {
    if (!err) {
      callback(false);
    } else {
      callback("Error deleting file");
    }
  });
};

// Exported module
module.exports = lib;
