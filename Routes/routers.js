import express from "express";
import { authentification, create, userExist, readAllUsers} from "../Controller/users/userControllers.js";
const router = express.Router();

router.post('/user', create);

router.get('/user', userExist);
//()=>{}
router.get('/users', readAllUsers);

router.post('/login', authentification);

export default router;