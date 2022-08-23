import express from "express";
import { getAllUsers, authenticateUser, getUser, createUser} from "../Controller/users/userControllers.js";
import { authenticateToken, checkUserType } from "../Middleware/userMiddleware.js";
const router = express.Router();

router.post('/user', createUser);

router.get('/user',authenticateToken, getUser);

router.get('/users', authenticateToken,checkUserType, getAllUsers);

router.post('/login',authenticateToken, authenticateUser);

export default router;