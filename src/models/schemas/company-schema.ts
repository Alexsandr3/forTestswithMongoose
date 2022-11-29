import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {CompanyAcountDBType, StatusActivations} from "../../types/company-type";

const companySchema = new mongoose.Schema<CompanyAcountDBType>({
    _id: ObjectId,
    accountData: {
        companyName: {type: String, required: true, minlength: 1, maxlength: 100},
        login: {type: String, unique: true, required: true, minlength: 3, maxlength: 50},
        email: {type: String, unique: true, required: true},
        passwordHash: {type: String, required: true},
        createdAt: {type: String, required: true}
    },
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        expirationDate: Date,
        isConfirmation: {type: Boolean, default: false}
    },
    emailRecovery: {
        recoveryCode: {type: String, required: true},
        expirationDate: Date,
        isConfirmation: {type: Boolean, default: false}
    },
    wallet: {
        deposit: {type: Number, default: 0},
        statusActivations: {type: String, default: 'deactivated', enum: StatusActivations}
    }
});
export const CompanyModelClass = mongoose.model('companies', companySchema);