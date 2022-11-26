import {Request, Response, NextFunction} from "express";
import {companyService} from "../service/company-service";
import {BodyParams_CompanyInputModel} from "../models/BodyParams_CompanyInputModel";
import {validationResult} from "express-validator";
import {ApiErrors} from "../exceptions/api-errors";
import {BodyParams_RegistrationConfirmationCodeInputModel} from "../models/BodyParams_ConfirrmationCodeInputModel";
import {BodyParams_LoginInputModel} from "../models/BodyParams_loginInputModel";
import {jwtService} from "../service/jwt-service";
import {deviceRepositories} from "../repositories/device-repositories";
import {PayloadDto} from "../dtos/payload-dto";
import {companyQueryRepositories} from "../repositories/company-query-repositories";
import {BodyParams_RegistrationEmailResendingInputModel} from "../models/BodyParams_EmailResendingInputModel";
import {BodyParams_newPasswordInputModel} from "../models/BodyParams_newPasswordInputModel";


class CompanyController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiErrors.BAD_REQUEST_400(`Incorrect input data`, errors.array()))
            }
            const {nameCompany, login, email, password}: BodyParams_CompanyInputModel = req.body
            await companyService.registration(nameCompany, login, email, password)
            return res.sendStatus(204)

        } catch (errors) {
            next(errors)
        }
    }

    async confirmation(req: Request, res: Response, next: NextFunction) {
        try {
            const {code}: BodyParams_RegistrationConfirmationCodeInputModel = req.body
            await companyService.confirmation(code)
            return res.sendStatus(204)
            //return res.redirect(process.env.CLIENT_URL) ///???? check
        } catch (errors) {
            next(errors)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiErrors.BAD_REQUEST_400(`Incorrect input data`, errors.array()))
            }
            const ipAddress = req.ip
            const deviceName = req.headers["user-agent"]
            const {login, password}: BodyParams_LoginInputModel = req.body
            const token = await companyService.login(login, password, ipAddress, deviceName!)
            res.cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true});
            return res.send({'accessToken': token.accessToken})
        } catch (errors) {
            next(errors)
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies
            if (!refreshToken) throw ApiErrors.UNAUTHORIZED_401(`Did not come refreshToken`)
            const payload = await jwtService.verifyToken(refreshToken)
            const payloadDto = new PayloadDto(payload)
            if (payloadDto.exp < new Date().toISOString()) throw ApiErrors.UNAUTHORIZED_401(`Expired date`)
            const deviceUser = await deviceRepositories.findDeviceForValid(payloadDto)
            if (!deviceUser) throw ApiErrors.UNAUTHORIZED_401(`Incorrect userId or deviceId or issuedAt`)
            const token = await companyService.refreshToken(payloadDto)
            res.cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true});
            return res.send({'accessToken': token.accessToken})
        } catch (errors) {
            next(errors)
        }
    }

    async resending(req: Request, res: Response, next: NextFunction) {
        try {
            const {email}: BodyParams_RegistrationEmailResendingInputModel = req.body
            await companyService.resending(email)
            return res.sendStatus(204)
        } catch (errors) {
            next(errors)
        }

    }

    async recovery(req: Request, res: Response, next: NextFunction) {
        try {
            const {email}: BodyParams_RegistrationEmailResendingInputModel = req.body
            await companyService.recovery(email)
            return res.sendStatus(204)
        } catch (errors) {
            next(errors)
        }

    }

    async newPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const {newPassword, recoveryCode}: BodyParams_newPasswordInputModel = req.body
            await companyService.newPassword(newPassword, recoveryCode)
            return res.sendStatus(204)
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

    async companies(req: Request, res: Response, next: NextFunction) {
        try {
            const companies = await companyQueryRepositories.getCompanies()
            return res.json({companies})
        } catch (errors) {
            next(errors)
        }
    }

}

export const companyController = new CompanyController()