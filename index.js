const express = require("express");
const initiateMongoServer = require("./config/db");

const app = express();
initiateMongoServer();
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const port = 3000;
app.listen(port, () => {
    console.log(`The server is running on port  ${port}`);
});