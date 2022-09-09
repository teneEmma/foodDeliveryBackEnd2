require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const maxAge = process.env.MAX_AGE;
const maxRefreshAge = process.env.MAX_REFRESH_AGE;

function generateToken(user) {
    return jwt.sign(user, TOKEN_SECRET, { expiresIn: maxAge });
}

function generateRefreshToken(user) {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: maxRefreshAge });
}

async function hashPasword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

module.exports = {generateToken, generateRefreshToken, hashPasword};