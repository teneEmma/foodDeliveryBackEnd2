const express = require("express");
const { authenticateUser, getUser, createUser, refreshToken, personal, getAllUsers } = require("../Controller/users/userControllers.js");
const { authenticateRefreshToken, authenticateToken, checkUserType, verifyIfUserExist } = require("../Middleware/userMiddleware.js");
const routes = express.Router();

routes.post('/signup', verifyIfUserExist, createUser);

routes.get('/user',authenticateToken, getUser);

routes.get('/users', authenticateToken, checkUserType, getAllUsers);

routes.post('/login', authenticateUser);

routes.post('/refreshToken', authenticateRefreshToken,  refreshToken);

routes.post('/personal', personal);

module.exports = routes;