import {Router} from "express";
import {adminController, middlewareService} from "../composition-root";
import {depositValidation} from "../middlewares/validators/admin-validator";
import {loginInputValidation, loginValidation, passwordValidation} from "../middlewares/validators/auth-validator";

export const adminRoute = Router({})

adminRoute.post('/registration', loginValidation, passwordValidation, adminController.registrationAdmin.bind(adminController))
adminRoute.post('/login', loginInputValidation, adminController.loginAdmin.bind(adminController))
adminRoute.post('/refresh-token', adminController.refreshToken.bind(adminController))


adminRoute.get(`/companies`,
    middlewareService.authAdminMiddleware.bind(middlewareService),
    adminController.getCompanies.bind(adminController))
adminRoute.get(`/companies/:companyId`,
    middlewareService.authAdminMiddleware.bind(middlewareService),
    adminController.findCompany.bind(adminController))
adminRoute.delete(`/companies/:companyId`,
    middlewareService.authAdminMiddleware.bind(middlewareService),
    adminController.deleteCompany.bind(adminController))
adminRoute.post(`/companies/:companyId`)
adminRoute.put(`/companies/:companyId`,
    middlewareService.authAdminMiddleware.bind(middlewareService),
    depositValidation,
    adminController.updateDeposit.bind(adminController))

adminRoute.get(`/menu`)
adminRoute.get(`/reports`)

