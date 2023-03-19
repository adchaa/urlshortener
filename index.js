require("dotenv").config();
const dns = require("node:dns");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});
var urls = [];
app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;
  const { hostname } = new URL(url);
  dns.lookup(hostname, (err, address, family) => {
    if (err) {
      console.log(err);
      return res.json({ error: "invalid url" });
    } else {
      if (
        urls.find((value) => {
          return value.original_url == url;
        }) != undefined
      ) {
        return res.json(
          urls.find((value) => {
            return value.original_url == url;
          })
        );
      } else {
        urls.push({ original_url: url, short_url: urls.length + 1 });
        return res.json(urls[urls.length - 1]);
      }
    }
  });
});
app.get("/api/shorturl/:short", (req, res) => {
  const url_long = urls.find((value) => {
    return req.params.short == value.short_url;
  });
  const url = url_long.original_url;
  res.redirect(url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
