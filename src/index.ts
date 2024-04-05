import express from 'express';
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { router,authRouter } from "./routes/router.js"
import dotenv from 'dotenv';
import { errorHandler } from './utils/errorHandler.js';
import {startDBScheduledJobs}  from "./utils/scheduled.js"
import { initDatabase} from "./model/bd.js"
import morgan from 'morgan';

const jsonParser = bodyParser.json();
dotenv.config();
initDatabase();
const app = express();
app.set("view engine", "ejs");
app.use(morgan('tiny'))
app.use(errorHandler)
app.use(fileUpload({
    limits: {
        fileSize: 10000000,
    },
    abortOnLimit: true,
})
);
app.use(jsonParser)
app.use(router)
app.use(authRouter)

startDBScheduledJobs()
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port localhost:${process.env.PORT}`)
})