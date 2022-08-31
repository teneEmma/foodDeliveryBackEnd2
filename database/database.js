const mongoose = require("mongoose");

const mongoDBServer = "mongodb+srv://kodage:MuvqzFP8quNQUdbU@fooddeliveryusers.ksoak.mongodb.net/deliveryApp?retryWrites=true&w=majority";
class UserDatabase{

    static connect(){
         mongoose.connect(mongoDBServer)
        .then(()=>{
            console.log("connection successfull with server");
        }).catch(error =>{
            console.log(`couldn't connect with mongodb \nerror --->${error}<---`);
        });
    }
}

module.exports = UserDatabase;