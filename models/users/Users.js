const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username : {type: String, unique: true, required: true},
    email : String,
    password : String,
    phoneNumber : String,
    userType : String
});

const users = mongoose.model("users",userSchema);
module.exports = users;