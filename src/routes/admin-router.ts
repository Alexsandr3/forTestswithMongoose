import {Router} from "express";
import {adminController} from "../composition-root";
import {depositValidation} from "../middlewares/validators/admin-validator";
import {basicAutoritionMiddleware} from "../middlewares/basic-autorition-middleware";


export const adminRoute = Router({})


adminRoute.get(`/companies`, basicAutoritionMiddleware, adminController.getCompanies.bind(adminController))
adminRoute.get(`/companies/:companyId`, basicAutoritionMiddleware, adminController.findCompany.bind(adminController))
adminRoute.delete(`/companies/:companyId`, basicAutoritionMiddleware, adminController.deleteCompany.bind(adminController))
adminRoute.post(`/companies/:companyId`)
adminRoute.put(`/companies/:companyId`, depositValidation, adminController.updateDeposit.bind(adminController))

adminRoute.get(`/menu`)
adminRoute.get(`/reports`)

