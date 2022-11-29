import  {body} from "express-validator";

export const depositValidation =
    body('deposit',
        'deposit must be a number')
        .toInt()
        .trim()
        .isLength({min: 1, max: 30})


