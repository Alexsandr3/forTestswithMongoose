import {Request, Response, NextFunction} from "express";
import {ApiErrors} from "../exceptions/api-errors";


export const errorsMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiErrors){
        res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: `This is pizdec ~ 500 code`})
}

