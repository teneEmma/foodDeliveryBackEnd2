import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    username : String,
    email : String,
    password : String,
    phoneNumber : String,
    userType : String
});

export const users = mongoose.model("users",userSchema);