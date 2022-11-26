import {Router} from "express";
import {userController} from "../controllers/user-controller";
import {
    loginInputValidation,
    registrationInputValidation,
} from "../validators/auth-validator";


export const authRoute = Router({})


authRoute.post('/password-recovery', userController.recovery)
authRoute.post('/new-password', userController.newPassword)
authRoute.post('/refresh-token', userController.refreshToken)


authRoute.post('/registration', registrationInputValidation, userController.registration)
authRoute.post('/registration-confirmation', userController.confirmation)
authRoute.post('/login', loginInputValidation, userController.login)


authRoute.post('/registration-email-resending', userController.resending)
authRoute.post('/logout', userController.logout)
authRoute.get('/me', userController.me)
