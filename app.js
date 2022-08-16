import express from "express";
import UserDatabase from "./database/database.js";
import router from "./Routes/routers.js";
import bodyParser from "body-parser";
const app = express();

const myPORT = process.env.PORT || 3000;
const myURI = `http:// 192.168.118.218:${myPORT}`;

app.use(bodyParser.json());
//Routes ()=>
UserDatabase.connect();

app.use(router);

app.listen(myPORT, ()=>{
    console.log(`Listening at ${myURI}`);
});