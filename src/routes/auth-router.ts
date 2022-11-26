import {Router} from "express";
import {userController} from "../controllers/user-controller";
import {
    emailValidation,
    loginInputValidation, newPasswordValidation,
    registrationInputValidation,
} from "../validators/auth-validator";


export const authRoute = Router({})


authRoute.post('/refresh-token', userController.refreshToken)
authRoute.post('/registration', registrationInputValidation, userController.registration)
authRoute.post('/registration-confirmation', userController.confirmation)
authRoute.post('/login', loginInputValidation, userController.login)
authRoute.post('/registration-email-resending', userController.resending)
authRoute.post('/password-recovery', emailValidation, userController.recovery)
authRoute.post('/new-password', newPasswordValidation, userController.newPassword)


authRoute.post('/logout', userController.logout)

authRoute.get('/users', userController.users)
