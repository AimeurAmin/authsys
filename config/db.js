const mongoose = require("mongoose");

// databse uri
const uri = "mongodb+srv://Amin:8Rg2JQAeRRooFTJN@cluster0.hshqp.mongodb.net/authdb?retryWrites=true&w=majority";

// establising connection to the database authdb on mongodb
const initiMongoServer = () => mongoose.connect(uri, { 
    useNewUrlParser: true, useUnifiedTopology: true
  }).then(() => {
      console.log('connection established');
  }).catch( _ => {
      console.log(_);
});

module.exports = initiMongoServer;