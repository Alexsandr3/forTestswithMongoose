import {CompanyAcountDBType, StatusActivations} from "../types/company-type";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";
import add from "date-fns/add";
import {CompanyModelClass} from "../models/schemas/company-schema";

export class CompanyRepositories {
    async registration(companyName: string, login: string, email: string, passwordHash: string): Promise<CompanyAcountDBType> {
        const company = new CompanyAcountDBType(
            new ObjectId(),
            {
                companyName,
                login,
                email,
                passwordHash,
                createdAt: new Date().toISOString()
            },
            {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmation: false
            },
            {
                recoveryCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmation: false
            },
            {
                deposit: 0,
                statusActivations: StatusActivations.deactivated
            }
        )
        return await CompanyModelClass.create(company)
    }

    async findCompany(loginOrEmail: string): Promise<boolean | null> {
        const result = await CompanyModelClass.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]})
        if (result) return null
        return true
    }

    async findCompanyByCode(confirmationCode: string): Promise<CompanyAcountDBType | null> {
        return CompanyModelClass.findOne({"emailConfirmation.confirmationCode": confirmationCode})
    }

    async updateStatusCodeConfirmation(_id: ObjectId): Promise<boolean> {
        const result = await CompanyModelClass.updateOne({_id: _id}, {$set: {'emailConfirmation.isConfirmation': true}})
        return result.modifiedCount === 1
    }

    async findByName(loginOrEmail: string) {
        return CompanyModelClass.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]});
    }

    async updateCodeConfirmation(_id: ObjectId, code: string, expirationDate: Date): Promise<boolean> {
        const result = await CompanyModelClass.updateOne({_id: _id}, {
            $set: {
                'emailConfirmation.confirmationCode': code,
                "emailConfirmation.expirationDate": expirationDate
            }
        })
        return result.modifiedCount === 1
    }

    async updateCodeRecovery(_id: ObjectId, code: string, expirationDate: Date): Promise<boolean> {
        const result = await CompanyModelClass.updateOne({_id: _id}, {
            $set: {
                'emailRecovery.recoveryCode': code,
                "emailRecovery.expirationDate": expirationDate
            }
        })
        return result.modifiedCount === 1
    }

    async findUserByRecoveryCode(recoveryCode: string): Promise<CompanyAcountDBType | null> {
        return CompanyModelClass.findOne({'emailRecovery.recoveryCode': recoveryCode})
    }

    async updateRecovery(_id: ObjectId, passwordHash: string): Promise<boolean> {
        const result = await CompanyModelClass.updateOne({_id: _id}, {
            $set: {
                'accountData.passwordHash': passwordHash,
                'emailRecovery.isConfirmation': true
            }
        })
        return result.modifiedCount === 1
    }

}

