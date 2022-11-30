import {NextFunction, Request, Response} from "express";
import {AdminQueryRepositories} from "../repositories/admin-query-repositories";
import {AdminService} from "../service/admin-service";
import {BodyParams_depositWalletInputModel} from "../models/BodyParams_depositWalletInputModel";
import {validationResult} from "express-validator";
import {ApiErrors} from "../exceptions/api-errors";
import {BodyParams_LoginInputModel} from "../models/BodyParams_loginInputModel";
import {BodyParams_AdminInputModel} from "../models/BodyParams_AdminInputModel";
import {JwtService} from "../service/jwt-service";


export class AdminController {
    constructor(
        protected adminQueryRepositories: AdminQueryRepositories,
        protected adminService: AdminService,
        protected jwtService: JwtService) {
    }

    async loginAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiErrors.BAD_REQUEST_400(`Incorrect input data`, errors.array()))
            }
            const ipAddress = req.ip
            const deviceName = req.headers["user-agent"]
            const {login, password}: BodyParams_LoginInputModel = req.body
            const token = await this.adminService.loginAdmin(login, password, ipAddress, deviceName!)
            res.cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true});
            return res.send({'accessToken': token.accessToken})
        } catch (errors) {
            next(errors)
        }
    }

    async registrationAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiErrors.BAD_REQUEST_400(`Incorrect input data`, errors.array()))
            }
            const {login, password}: BodyParams_AdminInputModel = req.body
            await this.adminService.registrationAdmin(login, password)
            return res.sendStatus(204)
        } catch (errors) {
            next(errors)
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies
            const token = await this.adminService.refreshToken(refreshToken)
            res.cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true});
            return res.send({'accessToken': token.accessToken})
        } catch (errors) {
            next(errors)
        }
    }

    async getCompanies(req: Request, res: Response, next: NextFunction) {
        try {
            const companies = await this.adminQueryRepositories.getCompanies()
            return res.status(200).send(companies)
        } catch (errors) {
            next(errors)
        }
    }

    async findCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const {companyId} = req.params
            const company = await this.adminService.findCompany(companyId)
            return res.status(200).send(company)
        } catch (errors) {
            next(errors)
        }
    }

    async deleteCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const {companyId} = req.params
            await this.adminService.deleteCompany(companyId)
            return res.sendStatus(204)
        } catch (errors) {
            next(errors)
        }
    }

    async updateDeposit(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiErrors.BAD_REQUEST_400(`Incorrect input data`, errors.array()))
            }
            const {deposit}: BodyParams_depositWalletInputModel = req.body
            const {companyId} = req.params
            await this.adminService.updateDeposit(deposit, companyId)
            return res.sendStatus(204)
        } catch (errors) {
            next(errors)
        }
    }
}

