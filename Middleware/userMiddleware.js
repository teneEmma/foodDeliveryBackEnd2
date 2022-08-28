import jwt from "jsonwebtoken";
import { ResponseObj } from "../models/ResponseModel/Response.js";
import bcrypt from "bcryptjs";
import { getUserValidation } from "../Controller/users/validation.js";
import { users } from "../models/users/Users.js";

const TOKEN_SECRET = "Kodage's Refresh Very Secret";
const REFRESH_TOKEN_SECRET = "Kodage's Very Secret";
const maxAge = 120;
const maxRefreshAge = 240;

export function generateToken(user) {
    return jwt.sign(user, TOKEN_SECRET, { expiresIn: maxAge });
}

export function generateRefreshToken(user){
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: maxRefreshAge });
}

export async function hashPasword(password){
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
}

export function authenticateRefreshToken(req, res, next){
    const { TokenExpiredError } = jwt;
    const refreshToken = req.headers.authorization;

    var response = new ResponseObj();
    response.setTokens(null, refreshToken);

    if (refreshToken === undefined) {
        return res.status(401).send(response.onError("Empty Header. You must provide a token."));
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, decodedToken) => {
        if (error instanceof TokenExpiredError) {
            return res.status(301).send(response.onError("Refresh token is expired. You need to SignIn Again"));
        }else if(error){
            return res.status(401).send(response.onError(JSON.stringify(error)));
        }

        req.refreshToken = refreshToken;
        req.decodedToken = decodedToken;//Improvising
        next();
    });
}

export async function verifyIfUserExist(req, res, next){
    var response = new ResponseObj();

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

export function authenticateToken(req, res, next){
    const token = req.headers.authorization;

    console.log(token);

    var response = new ResponseObj();
    response.setTokens(token, null);

    if(token === undefined){
        return res.status(401).send(response.onError("Empty Header. You must provide a token."));
    }
    
    jwt.verify(token, TOKEN_SECRET, (error, decodedToken)=>{
        if(error){
            res.status(401).send(response.onError(JSON.stringify(error)));
            return console.log(JSON.stringify(response)  + " error ->" + error);

        }

        req.token = token;
        //req.decodedToken = decodedToken;//Improvising
        next();
    });

}

export function checkUserType(req, res, next){
    const token = req.headers.authorization;

    var response = new ResponseObj();
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