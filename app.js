import express from "express";
import UserDatabase from "./database/database.js";
import router from "./Routes/routers.js";
import bodyParser from "body-parser";
const app = express();

const PORT = process.env.PORT || 3000;
const URI = `http:// 192.168.118.218:${PORT}`;

app.use(bodyParser.json());
//Routes ()=>
UserDatabase.connect();

app.use(router);

app.listen(PORT, ()=>{
    console.log(`Listening at ${URI}`);
});