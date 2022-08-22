import express from "express";
import { getAllUsers, authenticateUser, getUser, createUser} from "../Controller/users/userControllers.js";
import { authenticateToken } from "../Middleware/userMiddleware.js";
const router = express.Router();

router.post('/user', createUser);

router.get('/user', getUser);

router.get('/users', authenticateToken, getAllUsers);

router.post('/login',authenticateToken, authenticateUser);

export default router;