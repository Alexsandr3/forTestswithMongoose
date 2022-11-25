import mongoose from "mongoose";
import {ObjectId} from "mongodb";

const userSchema = new mongoose.Schema({
    _id: ObjectId,
    accountData: {
        nameCompany: {type: String, unique: true, required: true},
        firstName: {type: String,  required: true},
        lastName: {type: String, required: true},
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
    }
});
export const UserModelClass = mongoose.model('users', userSchema);