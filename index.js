const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");

app.use("/public", express.static("public"));

app.get("/alerts", (req, res) => {
    res.sendFile(__dirname + "/public/alerts.html");
});

app.listen(8080, function (err) {
    console.log("Listening on 8080!");
});