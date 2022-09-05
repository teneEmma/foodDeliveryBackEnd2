const express = require("express");
const UserDatabase = require("./database/database.js");
const routes = require("./Routes/routes.js");
require("dotenv").config();
const bodyParser = require("body-parser");
const { verifyIfUserExist, authenticateToken, checkUserType, authenticateRefreshToken } = require("./Middleware/userMiddleware.js");
const { createUser, personal, authenticateUser, getAllUsers, getUser, refreshToken } = require("./Controller/users/userControllers.js");
const app = express();

app.use(bodyParser.json());

UserDatabase.connect();

app.post('/signup', verifyIfUserExist, createUser);

app.get('/user', authenticateToken, getUser);

app.get('/users', authenticateToken, checkUserType, getAllUsers);

app.post('/login', authenticateUser);

app.post('/refreshToken', authenticateRefreshToken, refreshToken);

app.post('/personal', personal);

app.listen(process.env.PORT, () => {
    console.log(`Listening at ${process.env.SERVER_URI}`);
});