const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = mongoose.Schema({
    username : {type: String, unique: true, required: true},
    email : String,
    password : String,
    phoneNumber : String,
    userType : String
});

const users = mongoose.model(process.env.MONGOOSE_SCHEMA_NAME,userSchema);
module.exports = users;