const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

require("./routes/authRoutes")(app);

if (process.env.NODE_ENV === "production") {
  // Express serve static assets in production like main.js
  app.use(express.static("client/build"));
  // Express will serve index.html if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
