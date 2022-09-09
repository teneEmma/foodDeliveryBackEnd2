const ResponseObj = require("../../models/ResponseModel/Response.js");
const users = require("../../models/users/Users.js");
const { validateCreateUserModel, validateUserModelFromHeader, validateLoginUserModel } = require("./validation.js");
const bcrypt = require("bcryptjs");
const { generateRefreshToken, generateToken, hashPasword } = require("../../Controller/authenticationController.js");
const MessageObj = require("../../Constants/messages.js");
const code = require("../../Constants/networkCodes.js");
var response = new ResponseObj();

async function createUser(req, res){

    const { error } = validateCreateUserModel(req.body);
    const { password } = req.body;
     
    if (error) {
        return res.status(code.clientError.badrequest).send(response.onError(error.details[0].message));
    }

    const userResult = await users.find({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    
    if (userResult.length !== 0){
        return res.status(code.clientError.forbidden).send(response.onError(MessageObj.error.duplicatingData));
    }
    
    req.body.password = await hashPasword(password);

    await users.create(req.body)
        .then(success => {
            success.password = undefined;
            res.status(code.successful.created).send(response.onSuccess(MessageObj.success.createdUser, success));
        }).catch(error => {
            res.status(code.clientError.badrequest).send(response.onError(error));
        });
}

async function getUser(req, res){
     
    const schema = { 
        email: req.query.email,
        username: req.query.username };
    const { error } = validateUserModelFromHeader(schema);

    if(error){
        return res.status(code.clientError.badrequest).send(response.onError(error.details[0].message));
    }
    var userResult = await users.find({$or: [{username: req.query.username}, {email: req.query.email}]});

    if(userResult.length === 0){
        return res.status(code.successful.ok).send(response.onError(MessageObj.success.userNotTaken));
    }
    
    userResult[0].password = undefined;
    res.status(code.successful.ok).send(response.onSuccess(MessageObj.error.userTaken, userResult));
}

async function getAllUsers(req, res){
    var response =new ResponseObj();
    const usersResult = await users.find()
    .catch(error=>{
        return res.status(code.clientError.badrequest).send(response.onError(error));
    });

    usersResult.map(obj =>{
        obj.password = undefined;
        return obj;
    });
    res.status(code.successful.ok).send(response.onSuccess(MessageObj.success.listOfUsers, usersResult));
}

async function authenticateUser(req, res){
    var response = new ResponseObj();
     
    const { error } = validateLoginUserModel(req.body);
  
    if(error){
        return res.status(code.clientError.badrequest).send(response.onError(error.details[0].message));
    }

    const {email, password} = req.body;

    var userResult = await users.findOne({email})
    .catch(error=>{
        return res.status(code.clientError.notFound).send(response.onError(error));
    });

    if(userResult){
        const passwordsAreSame = await bcrypt.compare(password, userResult.password);

        if (passwordsAreSame) {
            const refreshToken = generateRefreshToken({email: req.body.email});
            const token = generateToken({ user: userResult});
            response.setTokens(token, refreshToken);
            return res.status(code.successful.Accepted).send(response.onSuccess(MessageObj.success.loggedIn, undefined));
        }
    }

    res.status(code.clientError.notFound).send(response.onError(MessageObj.error.credentialsIncorrect));
}

async function refreshToken(req, res){
     
    const{ email } =req.decodedToken;

    var userResult = await users.findOne({ email })
        .catch(error => {
            res.status(code.successful.notFound).send(response.onError(error));
        });

        if(userResult){
            const accessToken = generateToken({user: userResult});
            response.setTokens(accessToken);
            
            return res.status(code.successful.ok).send(response.onSuccess(MessageObj.success.refreshedToken, undefined));
        }
}

module.exports = {getAllUsers, createUser, getUser, authenticateUser, refreshToken};