import { query } from "express";
import { ResponseObj } from "../../models/ResponseModel/Response.js";
import { users } from "../../models/users/Users.js";
import { createUserValidation, getUserValidation, authenticateUserValidation } from "./validation.js";

export async function createUser(req, res){

    const { error } = createUserValidation(req.body);
    var response = new ResponseObj();

    if (error) {
        return res.status(400).send(response.onError(error.details[0].message));
    }

    const userResult = await users.find({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    
    if (userResult.length !== 0){
        return res.status(403).send(response.onError("Trying To Duplicate Data"));
    }

    await users.create(req.body)
        .then(success => {
            res.status(201).send(response.onSuccess("User Created Successfuly", success));
        }).catch(error => {
            res.status(400).send(response.onError(error));
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
    const userResult = await users.find({$or: [{username: req.query.username}, {email: req.query.email}]});

    if(userResult.length === 0){
        return res.status(200).send(response.onError("Free to use"));
    }
    
    res.status(200).send(response.onSuccess("User Exist", userResult));
}

export async function getAllUsers(req, res){
    var response =new ResponseObj();

    const usersResult = await users.find()
    .catch(error=>{ 
        return res.status(400).send(response.onError(error));
    });

    res.status(200).send(response.onSuccess("List of Users Found", usersResult));
}

export async function authenticateUser(req, res){
    var response = new ResponseObj();

    const { error } = authenticateUserValidation(req.body);

    if(error){
        return res.status(400).send(response.onError(error.details[0].message));
    }

    const schema = {
        email: req.body.email,
        password: req.body.password
    };

    const userResult = await users.findOne(schema)
    .catch(error=>{
        res.status(404).send(response.onError(error));
    });

    res.status(200).send(response.onSuccess("Available Users", userResult));
}
