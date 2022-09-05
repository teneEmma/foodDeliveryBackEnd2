const jwt = require("jsonwebtoken");
var ResponseObj = require("../models/ResponseModel/Response.js");
const bcrypt = require("bcryptjs");
const { getUserValidation } = require("../Controller/users/validation.js");
const users = require("../models/users/Users.js");

const TOKEN_SECRET = "Kodage's Refresh Very Secret";
const REFRESH_TOKEN_SECRET = "Kodage's Very Secret";
const maxAge = 40;
const maxRefreshAge = 60;
var response = new ResponseObj();

function generateToken(user) {
    return jwt.sign(user, TOKEN_SECRET, { expiresIn: maxAge });
}

function generateRefreshToken(user){
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: maxRefreshAge });
}

async function hashPasword(password){
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
}

function authenticateRefreshToken(req, res, next){
    const { TokenExpiredError } = jwt;
    const refreshToken = req.headers.authorization;

     
    response.setTokens(null, refreshToken);

    if (refreshToken === undefined) {
        return res.status(401).send(response.onError("Empty Header. You must provide a token."));
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, decodedToken) => {
        if (error instanceof TokenExpiredError) {
            return res.status(401).send(response.onError("Refresh token is expired. You need to SignIn Again", 4001));
        }else if(error){
            return res.status(401).send(response.onError(JSON.stringify(error)));
        }

        req.refreshToken = refreshToken;
        req.decodedToken = decodedToken;//Improvising
        next();
    });
}

async function verifyIfUserExist(req, res, next){
     

    const schema = {
        email: req.query.email,
        username: req.query.username
    };
    const { error } = getUserValidation(schema);

    if (error) {
        return res.status(400).send(response.onError(error.details[0].message));
    }
    var userResult = await users.find({ $or: [{ username: req.query.username }, { email: req.query.email }] });

    console.log(userResult);
    if (userResult.length !== 0) {
        return res.status(403).send(response.onError("Trying To Duplicate Data. User Already Exist"));
    }
    next(); 
}

function authenticateToken(req, res, next){
    const token = req.headers.authorization;

    console.log(token);

    
    response.setTokens(token, null);

    if(token === undefined){
        return res.status(401).send(response.onError("Empty Header. You must provide a token."));
    }
    
    jwt.verify(token, TOKEN_SECRET, (error, decodedToken)=>{
        if(error){
            return res.status(401).send(response.onError(JSON.stringify(error), 4000));
        }

        req.token = token;
        next();
    });

}

function checkUserType(req, res, next){
    const token = req.headers.authorization;

     
    if (token === undefined) {
        return res.status(401).send(response.onError("Empty Header"));
    }

    jwt.verify(token, TOKEN_SECRET, (error, decodedToken) => {
        if (error) {
            return res.status(401).send(response.onError(JSON.stringify(error)));
        }

        const { userType } = decodedToken.user;
        if(userType === "CLIENT"){
            return res.status(401).send(response.onError("Not Authorised To Make Such a Request"));
        }

        next();
    });
}

module.exports = {
    generateToken, generateRefreshToken, authenticateRefreshToken, 
    authenticateToken, hashPasword, verifyIfUserExist, checkUserType 
};