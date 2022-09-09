const express = require("express");
const UserDatabase = require("./database/database.js");
const bodyParser = require("body-parser");
const { verifyIfUserExist, authenticateToken, checkUserType, authenticateRefreshToken } = require("./Middleware/userMiddleware.js");
const { createUser, personal, authenticateUser, getAllUsers, getUser, refreshToken } = require("./Controller/users/userControllers.js");
const routes = require("./Routes/routes.js");
const app = express();

app.use(bodyParser.json());

UserDatabase.connect();

app.use(routes);

module.exports = app;