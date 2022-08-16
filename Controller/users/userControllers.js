import { query } from "express";
import { ResponseObj, ResponseObj2 } from "../../models/ResponseModel/Response.js";
import { users } from "../../models/users/Users.js";
import { validateLogin } from "./validation.js";


export async function create(req, res){

    const {error} = validateLogin(req.body);
    var myResponse = new ResponseObj2();
    const response = await users.find({ $or: [{ username: req.body.username }, { email: req.body.email }] });

    if (error) {
        return res.status(400).send(myResponse.onError(error.details[0].message));
    }else{
        if (response.length !== 0){
            res.status(400).send(myResponse.onError("Trying To Duplicate Data"));
        }else{

            await users.create(req.body)
                .then(success => {
                    res.status(201).send(myResponse.onSuccess("User Created Successfuly", success));
                }).catch(error => {
                    res.status(400).send(myResponse.onError(error));
                });
        }
    }
}

export async function userExist(req, res){
    var myResponse = new ResponseObj2();
    const response = await users.find({$or: [{username: req.query.username}, {email: req.query.email}]});

    if(response.length === 0){
        res.send(myResponse.onError("Free to use"));
    }else{
        res.send(myResponse.onSuccess("User Exist", response));
    }
}

export async function readAllUsers(req, res){
    var responseObj =new ResponseObj2();
    const response = await users.find()
    .catch(error=>{ 
        responseObj.onError(error);
        res.status(400).send(responseObj.onError(error));
    });

    if (response) {
        console.log(responseObj.getReponse);
        res.status(200).send(responseObj.onSuccess("availabble users", response));
    } else {
        res.send(responseObj.onError("Database Empty"));
    }
}

export async function authentification(req, res){
    var myResponse = new ResponseObj2();
    const schema = {
        email: req.body.email,
        password: req.body.password
    };

    const response = await users.findOne(schema)
    .catch(error=>{
        res.status(404).send(myResponse.onError(error));
    });

    if (response) {
        res.status(200).send(myResponse.onSuccess("User Exist", response));
    } else {
        res.status(404).send(myResponse.onError("Couldn't Sign In"));
    }
}
