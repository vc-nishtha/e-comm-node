const mongoose = require("mongoose");
require('dotenv').config();

const uri = process.env.DATABASE_URI;

const initiateMongoServer = () => {
    try {
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Check connection with DB!!");
    } catch (e) {
        console.log("Error while connecting", e);
        throw e;
    }
};

module.exports = initiateMongoServer;