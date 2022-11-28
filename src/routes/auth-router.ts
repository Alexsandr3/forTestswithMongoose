import {Router} from "express";
import {
    emailValidation,
    loginInputValidation, newPasswordValidation,
    registrationInputValidation,
} from "../validators/auth-validator";
import {companyController} from "../composition-root";


export const authRoute = Router({})


authRoute.post('/registration', registrationInputValidation, companyController.registration.bind(companyController))
authRoute.post('/registration-confirmation', companyController.confirmation.bind(companyController))
authRoute.post('/login', loginInputValidation, companyController.login.bind(companyController))
authRoute.post('/refresh-token', companyController.refreshToken.bind(companyController))
authRoute.post('/registration-email-resending', companyController.resending.bind(companyController))
authRoute.post('/password-recovery', emailValidation, companyController.recovery.bind(companyController))
authRoute.post('/new-password', newPasswordValidation, companyController.newPassword.bind(companyController))


authRoute.post('/logout', companyController.logout.bind(companyController))

authRoute.get('/companies', companyController.companies.bind(companyController))
