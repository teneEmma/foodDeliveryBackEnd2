import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = mongoose.Schema({
    username : String,
    email : String,
    password : String,
    phoneNumber : String,
    userType : String
});

export const users = mongoose.model("users",userSchema);