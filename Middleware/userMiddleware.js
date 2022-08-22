import jwt from "jsonwebtoken";
import { ResponseObj } from "../models/ResponseModel/Response.js";
import bcrypt from "bcryptjs";


const secret = "Kodage's Very Secret";
const maxAge = 6000;

export function generateToken(id){
    return jwt.sign(id, secret, { expiresIn: maxAge });
}

export async function hashPasword(password){
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
}

export function authenticateToken(req, res, next){
    const token = req.headers.authorization;

    var response = new ResponseObj();
    response.setToken(token);
    if(token === null){
        return res.status(401).send(response.onError("Empty Header"));
    }
    
    jwt.verify(token, "Kodage's Very Secret", (error, decodedToken)=>{
        if(error){
            return res.status(401).send(response.onError("Token invalid or Expired"));
        }

        req.token = token;
        req.decodedToken = decodedToken;//Improvising
        next();
    });
}

export function checkUserType(req, res, next){
    const token = req.headers.authorization;

    var response = new ResponseObj();
    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, "Kodage's Very Secret", (error, decodedToken) => {
        if (error) {
            return res.redirect("/loginexp");
        }

        const bearerToken = token.split(' ')[1];
        req.token = bearerToken;
        next();
    });
}