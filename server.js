"use strict";
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");

const app = express();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// "script-src 'self' https://boilerplate-project-stockchecker.duncanndegwa.repl.co; style-src 'self' https://boilerplate-project-stockchecker.duncanndegwa.repl.co;"

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https://boilerplate-project-stockchecker.duncanndegwa.repl.co; script-src 'self' https://boilerplate-project-stockchecker.duncanndegwa.repl.co; style-src 'self' https://boilerplate-project-stockchecker.duncanndegwa.repl.co; connect-src 'https://replit.com/@duncanndegwa/boilerplate-project-stockchecker#public/script.js';"

  );
  next();
});

app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env["CONNECTIONSTRING"], {
    useNewURLParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("MongoDB is now connected."));

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        console.log("Tests are not valid:");
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
