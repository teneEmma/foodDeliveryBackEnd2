import express from "express";
import { getAllUsers, authenticateUser, getUser, createUser, refreshToken, personal } from "../Controller/users/userControllers.js";
import { authenticateRefreshToken, authenticateToken, checkUserType, verifyIfUserExist } from "../Middleware/userMiddleware.js";
const routes = express.Router();

routes.post('/signup', verifyIfUserExist, createUser);

routes.get('/user',authenticateToken, getUser);

routes.get('/users', authenticateToken, checkUserType, getAllUsers);

routes.post('/login', authenticateUser);

routes.post('/refreshToken', authenticateRefreshToken,  refreshToken);

routes.post('/personal', personal);

export default routes;