module.export = (function moduleLoader() {
  const dirPath = require("path").resolve(__dirname, "../features");
  //   var normalizedPath = require("path").join(__dirname, "routes");

  //   require("fs")
  //     .readdirSync(normalizedPath)
  //     .forEach(function(file) {
  //       require("./routes/" + file);
  //     });
  console.log(require("fs").readdirSync(dirPath));
})();
