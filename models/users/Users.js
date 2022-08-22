import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = mongoose.Schema({
    username : {type: String, unique: true, required: true},
    email : String,
    password : String,
    phoneNumber : String,
    userType : String
});

/*const secret = "Kodage's Very Secret";
const maxAge = 6000;


        userSchema.pre("save", async function(next){

        const userModel = {
            username: this.username,
            email: this.email,
            phoneNumber: this.phoneNumber,
            userType: this.userType
        };

        const salt = await bcrypt.genSalt(10);
        const password =await bcrypt.hash(this.password, salt);
        const token = generateToken(userModel);
        res.token = token;
        this.password = password;
        next();
        });*/

export const users = mongoose.model("users",userSchema);