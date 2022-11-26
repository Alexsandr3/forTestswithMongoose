import  {body} from "express-validator";

const nameCompanyValidation =
    body('nameCompany',
        `Name company must be a string, must not be empty, length should be 3..100 symbols`)
        .isString()
        .notEmpty()
        .trim()
        .isLength({min: 1, max: 100})
const loginValidation =
    body('login',
        `Login name must be a string, must not be empty length should be 3..50 symbols`)
        .isString()
        .notEmpty()
        .trim()
        .isLength({min: 3, max: 50})
export const emailValidation =
    body('email',
        'Should be valid email')
        .isString()
        .notEmpty()
        .trim()
        .isEmail()

const passwordValidation =
    body('password',
        'password must be a string, must not be empty')
        .isString()
        .notEmpty()
        .trim()
        .isLength({min: 6, max: 30})

export const newPasswordValidation =
    body('newPassword',
        'newPassword must be a string, must not be empty, length must be between 6 and 20 characters')
        .isString()
        .notEmpty()
        .trim()
        .isLength({min: 6, max: 30})

export const registrationInputValidation = [
    nameCompanyValidation,
    loginValidation,
    emailValidation,
    passwordValidation
]



export const loginInputValidation = [
    loginValidation,
    passwordValidation
]