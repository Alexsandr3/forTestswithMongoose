import {NextFunction, Request, Response} from "express";
import {ApiErrors} from "../exceptions/api-errors";
import {JwtService} from "../service/jwt-service";
import {AdminRepositories} from "../repositories/admin-repositories";


export class MiddlewareService {
    constructor(
        protected jwtService: JwtService,
        protected adminRepositories: AdminRepositories) {
    }

    async authAdminMiddleware(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization) {
                return next(ApiErrors.UNAUTHORIZED_401(`Did not come accessToken`))
            }
            const token = req.headers.authorization.split(' ')[1]
            const payloadAdmin = await this.jwtService.getAdminByToken(token)
            if (!payloadAdmin) {
                return next(ApiErrors.UNAUTHORIZED_401(`Admin not authorization`))
            }
            const admin = await this.adminRepositories.findAdmin(payloadAdmin.adminId, payloadAdmin.rol)
            if (!admin) {
                return next(ApiErrors.UNAUTHORIZED_401(`Admin not authorization`))
            }
            next()
        } catch (errors) {
            next(errors)
        }
    }
}
