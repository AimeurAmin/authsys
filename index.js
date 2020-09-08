const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express(); 

const PORT = process.env.PORT || 3000; //initializing port

// databse uri
const uri = "mongodb+srv://Amin:8Rg2JQAeRRooFTJN@cluster0.hshqp.mongodb.net/authdb?retryWrites=true&w=majority";

// establising connection to the database authdb on mongodb
mongoose.connect(uri, { 
    useNewUrlParser: true, useUnifiedTopology: true
  }).then(() => {
      console.log('connection established')
  }).catch( _ => {
      console.log(_)
});

app.get("/", (req, res) => { // first endpoint
  res.json({ message: "API Working" });
});

app.listen(PORT, (req, res) => {
  console.log(`Server On at PORT ${PORT}`);
});