import {Router} from "express";
import {adminController} from "../composition-root";
import {depositValidation} from "../middlewares/validators/admin-validator";

export const adminRoute = Router({})


adminRoute.get(`/companies`, adminController.getCompanies.bind(adminController))
adminRoute.get(`/companies/:companyId`, adminController.findCompany.bind(adminController))
adminRoute.delete(`/companies/:companyId`, adminController.deleteCompany.bind(adminController))
adminRoute.post(`/companies/:companyId`)
adminRoute.put(`/companies/:companyId`, depositValidation, adminController.updateDeposit.bind(adminController))

adminRoute.get(`/menu`)
adminRoute.get(`/reports`)

