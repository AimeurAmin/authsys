const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const user = require('./routes/user');
const signup = require('./routes/user/signup');
const login = require('./routes/user/login');
const profile = require('./routes/user/profile');
const initiMongoServer = require("./config/db");

const app = express(); 
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000; //initializing port

initiMongoServer(); // initializing db server

// first endpoint
app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

// user router middlerware (signup)
// app.use('/user', user);
app.use('/user', signup);
app.use('/user', login);
app.use('/user', profile);

// exposing port
app.listen(PORT, (req, res) => {
  console.log(`Server On at PORT ${PORT}`);
});