import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = mongoose.Schema({
    username : String,
    email : String,
    password : String,
    phoneNumber : String,
    userType : String
});

userSchema.pre("save", async function(next){
    console.log("*********in the pre function************");
    const {password} = this;
    const salt = await bcrypt.genSalt(10);
    const secondPassword =await bcrypt.hash(password, salt);
    console.log(`actual password: ${password}|| encrypted: ${secondPassword}`);

    next();
});

export const users = mongoose.model("users",userSchema);