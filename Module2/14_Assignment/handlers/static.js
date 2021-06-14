const fs = require('fs');
const path = require('path');

module.exports.default = function ({ trimmedPath }, callback) {
    trimmedPath = trimmedPath || "login.html";
    fs.readFile(path.resolve(__dirname, `../public/${trimmedPath}`), function (err, data) {
        if (err) {
            callback(404);
        } else {
            callback(200, data, true);
        }

    });
}











