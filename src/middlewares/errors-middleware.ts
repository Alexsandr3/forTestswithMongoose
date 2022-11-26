import {Request, Response, NextFunction} from "express";
import {ApiErrors} from "../exceptions/api-errors";


export const errorsMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("err", err)
    if (err instanceof ApiErrors){
        res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: `This is pizdec ~ 500 code`})
}





/*
export const errorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsCrudes = errors.array({onlyFirstError: true}).map(e => {
            return {
                message: e.msg,
                field: e.param
            }
        })
        return res.status(400).json({"errorsMessages": errorsCrudes})
    }
    next()
}*/
