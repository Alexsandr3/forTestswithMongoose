import {NextFunction, Request, Response} from "express";
import {AdminQueryRepositories} from "../repositories/admin-query-repositories";
import {AdminService} from "../service/admin-service";
import {BodyParams_depositWalletInputModel} from "../models/BodyParams_depositWalletInputModel";
import {validationResult} from "express-validator";
import {ApiErrors} from "../exceptions/api-errors";


export class AdminController {
    constructor(
        protected adminQueryRepositories: AdminQueryRepositories,
        protected adminService: AdminService) {
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
            const company = await this.adminService.findComapny(companyId)
            return res.status(200).send(company)
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

