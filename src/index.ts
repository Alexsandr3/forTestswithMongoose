import mongoose from "mongoose";
import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import {config} from "dotenv";
import {errorsMiddleware} from "./middlewares/errors-middleware";
import {authRoute} from "./routes/auth-router";
import {adminRoute} from "./routes/admin-router";
config()


const PORT = process.env.PORT || 5002
const mongoUri = process.env.MONGO_URI2 || "mongodb://0.0.0.0:27017";

export const app = express()
const jsonBodyMiddleware = bodyParser.json()


app.use(cors())
app.use(jsonBodyMiddleware)
app.use(cookieParser())
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Don't panic madam and mister, eats draniks. Build your own dreams, or someone else will hire you to build theirs."
    })
})
app.use('/auth', authRoute)
app.use('/admin', adminRoute)
app.set('trust proxy', true)
app.use(errorsMiddleware)


const startApp = async () => {
    try {
        await mongoose.connect(mongoUri, {dbName: 'delivery-automations'});
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
