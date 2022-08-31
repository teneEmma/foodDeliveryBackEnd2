const express = require("express");
const UserDatabase = require("./database/database.js");
const routes = require("./Routes/routes.js");
const bodyParser = require("body-parser");
const { verifyIfUserExist, authenticateToken, checkUserType, authenticateRefreshToken } = require("./Middleware/userMiddleware.js");
const { createUser, personal, authenticateUser, getAllUsers, getUser, refreshToken } = require("./Controller/users/userControllers.js");
const app = express();

const PORT = process.env.PORT || 3000;
const URI = `http:// 192.168.118.218:${PORT}`;

app.use(bodyParser.json());

UserDatabase.connect();

app.post('/signup', verifyIfUserExist, createUser);

app.get('/user', authenticateToken, getUser);

app.get('/users', authenticateToken, checkUserType, getAllUsers);

app.post('/login', authenticateUser);

app.post('/refreshToken', authenticateRefreshToken, refreshToken);

app.post('/personal', personal);

module.exports = app;