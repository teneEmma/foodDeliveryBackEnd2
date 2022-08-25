import express from "express";
import UserDatabase from "./database/database.js";
import routes from "./Routes/routes.js";
import bodyParser from "body-parser";
const app = express();

const PORT = process.env.PORT || 3000;
const URI = `http:// 192.168.118.218:${PORT}`;

app.use(bodyParser.json());

UserDatabase.connect();

app.use('/api', routes);

app.listen(PORT, ()=>{
    console.log(`Listening at ${URI}`);
});