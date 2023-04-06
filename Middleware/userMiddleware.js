const jwt = require("jsonwebtoken");
var ResponseObj = require("../models/ResponseModel/Response.js");
const { validateUserModelFromHeader } = require("../Controller/users/validation.js");
const users = require("../models/users/Users.js");
const MessageObj = require("../Constants/messages.js");
const code = require("../Constants/networkCodes.js");
const userType = require("../Constants/otherConstants.js");
require("dotenv").config();

var response = new ResponseObj();

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

function authenticateRefreshToken(req, res, next){
    const { TokenExpiredError } = jwt;
    const refreshToken = req.headers.authorization;

    if (refreshToken === undefined) {
        return res.status(code.clientError.unauthorized).send(response.onError(MessageObj.error.headerEmpty));
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, decodedToken) => {
        if (error instanceof TokenExpiredError) {
            return res.status(code.clientError.unauthorized).send(response.onError(MessageObj.error.expiredRefreshtoken, 4001));
        }else if(error){
            return res.status(code.clientError.unauthorized).send(response.onError(JSON.stringify(error)));
        }

        req.refreshToken = refreshToken;
        req.decodedToken = decodedToken;
        next();
    });
}

async function verifyIfUserExist(req, res, next){
     
    const schema = {
        email: req.query.email,
        username: req.query.username
    };
    const { error } = validateUserModelFromHeader(schema);

    if (error) {
        return res.status(code.clientError.badrequest).send(response.onError(error.details[0].message));
    }
    var userResult = await users.find({ $or: [{ username: req.query.username }, { email: req.query.email }] });

    if (userResult.length !== 0) {
        return res.status(code.clientError.forbidden).send(
            response.onError(MessageObj.error.duplicatingData + MessageObj.error.userTaken));
    }
    next(); 
}

function authenticateToken(req, res, next){
    const token = req.headers.authorization;
   
    response.setTokens(token, null);

    if(token === undefined){
        return res.status(code.clientError.badrequest).send(response.onError(MessageObj.error.headerEmpty));
    }
    
    jwt.verify(token, TOKEN_SECRET, (error, decodedToken)=>{
        if(error){
            return res.status(code.clientError.unauthorized).send(response.onError(JSON.stringify(error), 4000));
        }

        req.token = token;
        next();
    });

}

function checkUserType(req, res, next){
    const token = req.headers.authorization;
 
    if (token === undefined) {
        return res.status(code.clientError.unauthorized).send(response.onError(MessageObj.error.headerEmpty));
    }

    jwt.verify(token, TOKEN_SECRET, (error, decodedToken) => {
        if (error) {
            return res.status(code.clientError.unauthorized).send(response.onError(JSON.stringify(error)));
        }

        const userRole = decodedToken.user.userType;
        if(userRole === userType[0]){
            return res.status(code.clientError.unauthorized).send(response.onError(MessageObj.error.unauthorizedRequest));
        }

        next();
    });
}

module.exports = {
    authenticateRefreshToken, authenticateToken, verifyIfUserExist, checkUserType 
};