const mongoose = require("mongoose");
require("dotenv").config();

const mongoDBServer = process.env.MONGOOSE_URI;
class UserDatabase{

    static connect(){
         mongoose.connect(mongoDBServer);
    }
}

module.exports = UserDatabase;