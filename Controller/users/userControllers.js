const ResponseObj = require("../../models/ResponseModel/Response.js");
const users = require("../../models/users/Users.js");
const { createUserValidation, getUserValidation, authenticateUserValidation } = require("./validation.js");
const bcrypt = require("bcryptjs");
const { generateRefreshToken, generateToken, hashPasword } = require("../../Middleware/userMiddleware.js");
var response = new ResponseObj();

async function createUser(req, res){

    const { error } = createUserValidation(req.body);
    const { password } = req.body;
     

    if (error) {
        return res.status(400).send(response.onError(error.details[0].message));
    }

    const userResult = await users.find({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    
    if (userResult.length !== 0){
        return res.status(403).send(response.onError("Trying To Duplicate Data"));
    }
    
    req.body.password = await hashPasword(password);

    await users.create(req.body)
        .then(success => {
            success.password = undefined;
            res.status(201).send(response.onSuccess("User Created Successfully", success));
        }).catch(error => {
            res.status(400).send(response.onError(error));
        });
}

async function getUser(req, res){
     
    
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
    res.status(200).send(response.onSuccess("User Exists", userResult));
}

async function getAllUsers(req, res){
    var response =new ResponseObj();
    response.setTokens(req.token);
    const usersResult = await users.find()
    .catch(error=>{
        return res.status(400).send(response.onError(error));
    });

    res.status(200).send(response.onSuccess("List of Users", usersResult));
}

async function authenticateUser(req, res){
     

    const { error } = authenticateUserValidation(req.body);

    console.log("requestbody = "+JSON.stringify(req.body));
    
    if(error){
        return res.status(400).send(response.onError(error.details[0].message));
    }

    const {email, password} = req.body;//TODO: put this line below users.findOne. Beacause it is an unused resource here

    var userResult = await users.findOne({email})
    .catch(error=>{
        res.status(404).send(response.onError(error));
    });

    if(userResult){
        const passwordsAreSame = await bcrypt.compare(password, userResult.password);
        userResult.password = undefined;

        if (passwordsAreSame) {
            const refreshToken = generateRefreshToken({email: req.body.email});
            const token = generateToken({ user: userResult});
            response.setTokens(token, refreshToken);
            return res.status(200).send(response.onSuccess("Login Successful", userResult));
        }
    }

    res.status(404).send(response.onError("Email or Password incorrect"));

}

async function refreshToken(req, res){
     

    const{ email } =req.decodedToken;

    var userResult = await users.findOne({ email })
        .catch(error => {
            res.status(404).send(response.onError(error));
        });

        if(userResult){
            const accessToken = generateToken({user: userResult});
            response.setTokens(accessToken, req.refreshToken);
            userResult.password = undefined;
            
            return res.status(200).send(response.onSuccess("Token Refreshed Successfully", userResult));
        }
}

async function personal(req, res){
     var password= await hashPasword(req.body.password);
    res.send(password);
}

module.exports = {getAllUsers, createUser, getUser, authenticateUser, refreshToken, personal};