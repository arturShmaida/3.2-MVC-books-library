import express from 'express';
import bodyParser from "body-parser";
import path from 'path';
import { router } from "./routes/router.js"
import { UserController } from './controler/userController.js';
import dotenv from 'dotenv';

import {initDatabase, prefilTheDatabase } from "./model/bd.js" 


const morgan = require('morgan')
dotenv.config();
const port = process.env.PORT;

const app = express();
app.set("view engine", "ejs");
app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname+ "../../src/view/public")));
app.use(express.static(path.join(__dirname+ "../../src/view/public")));
app.use(express.static(path.join(__dirname+ "../../dist/view/public")));
app.use(router)
initDatabase();

app.listen(port, () => {
    console.log(`Listening on port localhost:${process.env.PORT}`)
})