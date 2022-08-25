import express from "express";
import { getAllUsers, authenticateUser, getUser, createUser, refreshToken } from "../Controller/users/userControllers.js";
import { authenticateRefreshToken, authenticateToken, checkUserType } from "../Middleware/userMiddleware.js";
const routes = express.Router();

routes.post('/signup', createUser);

routes.get('/user',authenticateToken, getUser);

routes.get('/users', authenticateToken,checkUserType, getAllUsers);

routes.post('/login', authenticateUser);

routes.post('/refreshToken', authenticateRefreshToken,  refreshToken);

export default routes;