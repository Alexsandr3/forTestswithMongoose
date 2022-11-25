import mongoose from "mongoose";
import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import {config} from "dotenv";
config()


const PORT = process.env.PORT || 5002
const mongoUri = process.env.MONGO_URI || "mongodb://0.0.0.0:27017";

export const app = express()
const jsonBodyMiddleware = bodyParser.json()


app.use(cors())
app.use(jsonBodyMiddleware)
app.use(cookieParser())
app.set('trust proxy', true)

const startApp = async () => {
    try {
       // await mongoose.connect(mongoUri, {dbName: 'delivery-automations'});
        console.log("Connected successfully to MONGOOSE server");
        app.listen(PORT, () => {
            console.log(`Example app listening on port: ${PORT}`)
        })
    } catch {
        console.log("Can't connect to db");
        await mongoose.disconnect()
    }
}
startApp()
