import {Router} from "express";
import {companyController} from "../composition-root";
import {
    emailValidation,
    loginInputValidation, newPasswordValidation,
    registrationInputValidation,
} from "../validators/auth-validator";


export const authRoute = Router({})


authRoute.post('/registration', registrationInputValidation, companyController.registration)
authRoute.post('/registration-confirmation', companyController.confirmation)
authRoute.post('/login', loginInputValidation, companyController.login)
authRoute.post('/refresh-token', companyController.refreshToken)
authRoute.post('/registration-email-resending', companyController.resending)
authRoute.post('/password-recovery', emailValidation, companyController.recovery)
authRoute.post('/new-password', newPasswordValidation, companyController.newPassword)


authRoute.post('/logout', companyController.logout)

authRoute.get('/companies', companyController.companies)
