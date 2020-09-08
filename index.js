const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const initiMongoServer = require("./config/db");

const app = express(); 
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000; //initializing port

initiMongoServer(); // initializing db server

// first endpoint
app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

// exposing port
app.listen(PORT, (req, res) => {
  console.log(`Server On at PORT ${PORT}`);
});