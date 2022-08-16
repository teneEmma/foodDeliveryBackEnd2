import express from "express";
import { getAllUsers, authenticateUser, getUser, createUser} from "../Controller/users/userControllers.js";
const router = express.Router();

router.post('/user', createUser);

router.get('/user', getUser);

router.get('/users', getAllUsers);

router.post('/login', authenticateUser);

export default router;