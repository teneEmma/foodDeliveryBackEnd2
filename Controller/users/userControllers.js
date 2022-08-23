import { query } from "express";
import { ResponseObj } from "../../models/ResponseModel/Response.js";
import { users } from "../../models/users/Users.js";
import { createUserValidation, getUserValidation, authenticateUserValidation } from "./validation.js";
import bcrypt from "bcryptjs";
import { generateToken, hashPasword } from "../../Middleware/userMiddleware.js";

export async function createUser(req, res){

    const { error } = createUserValidation(req.body);
    const { password } = req.body;
    var response = new ResponseObj();

    if (error) {
        return res.send(response.onError(error.details[0].message));
    }

    const userResult = await users.find({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    
    if (userResult.length !== 0){
        return res.status(403).send(response.onError("Trying To Duplicate Data"));
    }

    req.body.password = await hashPasword(password);

    await users.create(req.body)
        .then(success => {
            const token = generateToken({user: req.body});
            response.setToken(token);
            success.password = undefined;
            res.status(201).send(response.onSuccess("User Created Successfully", success));
        }).catch(error => {
            res.send(response.onError(error));
        });
}

export async function getUser(req, res){
    var response = new ResponseObj();
    
    const schema = { 
        email: req.query.email,
        username: req.query.username };
    const { error } = getUserValidation(schema);

    if(error){
        return res.status(400).send(response.onError(error.details[0].message));
    }
    var userResult = await users.find({$or: [{username: req.query.username}, {email: req.query.email}]});

    if(userResult.length === 0){
        return res.status(200).send(response.onError("Free to use"));
    }
    
    userResult[0].password = undefined;
    response.setToken(req.token);
    res.status(200).send(response.onSuccess("User Exists", userResult));
}

export async function getAllUsers(req, res){
    var response =new ResponseObj();

    const usersResult = await users.find()
    .catch(error=>{
        return res.status(400).send(response.onError(error));
    });

    response.setToken(req.token);
    res.status(200).send(response.onSuccess("List of Users Found", usersResult));
}

export async function authenticateUser(req, res){
    var response = new ResponseObj();

    const { error } = authenticateUserValidation(req.body);

    if(error){
        return res.status(400).send(response.onError(error.details[0].message));
    }

    const {email, password} = req.body;
    //TODO: In case the token info and the request data are different, we should implement an OTP request to validate the user

    var userResult = await users.findOne({email})
    .catch(error=>{
        res.status(404).send(response.onError(error));
    });

    if(userResult){
        const passwordsAreSame = await bcrypt.compare(password, userResult.password);
        userResult.password = undefined;

        if (passwordsAreSame) {
            return res.status(200).send(response.onSuccess("Available Users", userResult));
        }
        return res.send(response.onError("Wrong Password"));
    }

    res.send(response.onError("Email Is Not Registered"));
}
