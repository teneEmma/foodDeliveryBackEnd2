const express = require("express");
const UserDatabase = require("./database/database.js");
require("dotenv").config();
const bodyParser = require("body-parser");
const routes = require("./Routes/routes.js");
const app = express();

app.use(bodyParser.json());

UserDatabase.connect();

app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`Listening at ${process.env.SERVER_URI}:${process.env.PORT}`);
}); module.exports = app;