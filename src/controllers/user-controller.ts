import {Request, Response, NextFunction} from "express";
import {userService} from "../service/user-service";
import {BodyParams_UserInputModel} from "../models/BodyParams_UserInputModel";
import {validationResult} from "express-validator";
import {ApiErrors} from "../exceptions/api-errors";
import {BodyParams_RegistrationConfirmationCodeInputModel} from "../models/BodyParams_ConfirrmationCodeInputModel";
import {BodyParams_LoginInputModel} from "../models/BodyParams_loginInputModel";


class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // @ts-ignore
                return next(ApiErrors.BAD_REQUEST_400(`Incorrect input data`, errors.array()))
            }
            const {nameCompany, login, email, password}: BodyParams_UserInputModel = req.body
            await userService.registration(nameCompany, login, email, password)
            return res.sendStatus(204)
        } catch (errors) {
            next(errors)
        }
    }

    async confirmation(req: Request, res: Response, next: NextFunction) {
        try {
            const {code}: BodyParams_RegistrationConfirmationCodeInputModel = req.body
            await userService.confirmation(code)
            return res.sendStatus(204)
        } catch (errors) {
            next(errors)
        }

    }


    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // @ts-ignore
                return next(ApiErrors.BAD_REQUEST_400(`Incorrect input data`, errors.array()))
            }
            const ipAddress = req.ip
            const deviceName = req.headers["user-agent"]
            const {login, password}: BodyParams_LoginInputModel = req.body
            const token = await userService.login(login, password, ipAddress, deviceName!)
            res.cookie('refreshToken', token.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true, secure: true});
            return res.send({'accessToken': token.accessToken})
        } catch (errors) {
            next(errors)
        }

    }

    async resending(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (errors) {
            next(errors)
        }

    }

    async recovery(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (errors) {
            next(errors)
        }

    }

    async newPassword(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (errors) {
            next(errors)
        }

    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (errors) {
            next(errors)
        }

    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (errors) {
            next(errors)
        }

    }

    async me(req: Request, res: Response, next: NextFunction) {


    }
}

export const userController = new UserController()