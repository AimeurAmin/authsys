const express = require("express");
const bodyParser = require("body-parser");

const app = express(); 

const PORT = process.env.PORT || 3000; //initializing port

app.get("/", (req, res) => { // first endpoint
  res.json({ message: "API Working" });
});

app.listen(PORT, (req, res) => {
  console.log(`Server On at PORT ${PORT}`);
});