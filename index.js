// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
const { log } = require("console");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

function dateHandler(req, res, next) {
  let { date } = req.params;
  console.log(date);
  if (!date) {
    req.params.date = new Date().toUTCString();
  }
  next();
}

app.get("/api/", dateHandler, function (req, res) {
  let { date } = req.params;
  let unix = parseInt(new Date(date).getTime().toFixed(0));
  res.json({ unix: unix, utc: date });
});

function timeStamp(req, res, next) {
  let { date } = req.params;

  if (new Date(date).toUTCString() === "Invalid Date") {
    let isTimeStamp = new Date(++date).toUTCString();
    if (isTimeStamp !== "Invalid Date") {
      req.params.date = isTimeStamp;
    }
  } else {
    req.params.date = new Date(date).toUTCString();
  }
  next();
}

app.get("/api/:date", timeStamp, function (req, res) {
  let { date } = req.params;

  if (new Date(date).toUTCString() === "Invalid Date") {
    res.json({ error: "Invalid Date" });
  } else {
    let unix = parseInt(new Date(date).getTime().toFixed(0));
    res.json({ unix: unix, utc: date });
  }
});

app.listen(4000, () => {
  console.log("server running");
});

// listen for requests :)
// var listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
