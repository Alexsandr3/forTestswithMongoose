import  {body} from "express-validator";

export const depositValidation =
    body('deposit',
        'deposit must be a number')
        .toInt()
