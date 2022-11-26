import {UsersAcountDBType} from "../types/user-type";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";
import add from "date-fns/add";
import {UserModelClass} from "../models/user-model";

class UsersRepositories {
    async registration(nameCompany: string, login: string, email: string, passwordHash: string): Promise<UsersAcountDBType> {
        const user = new UsersAcountDBType(
            new ObjectId(),
            {
                nameCompany,
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
            }
        )
        return await UserModelClass.create(user)

    }

    async findCompany(loginOrEmail: string): Promise<boolean | null> {
        const result = await UserModelClass.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]})
        if (result) return null
        return true
    }

    async findCompanyByCode(confirmationCode: string): Promise<UsersAcountDBType | null> {
        return UserModelClass.findOne({"emailConfirmation.confirmationCode": confirmationCode})
    }

    async updateStatusCodeConfirmation(_id: ObjectId): Promise<boolean> {
        const result = await UserModelClass.updateOne({_id: _id}, {$set: {'emailConfirmation.isConfirmation': true}})
        return result.modifiedCount === 1
    }

    async findByName(loginOrEmail: string) {
        return UserModelClass.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]});
    }
    async updateCodeConfirmation(_id: ObjectId, code: string, expirationDate: Date): Promise<boolean> {
        const result = await UserModelClass.updateOne({_id: _id}, {
            $set: {
                'emailConfirmation.confirmationCode': code,
                "emailConfirmation.expirationDate": expirationDate
            }
        })
        return result.modifiedCount === 1
    }
    async updateCodeRecovery(_id: ObjectId, code: string, expirationDate: Date): Promise<boolean> {
        const result = await UserModelClass.updateOne({_id: _id}, {
            $set: {
                'emailRecovery.recoveryCode': code,
                "emailRecovery.expirationDate": expirationDate
            }
        })
        return result.modifiedCount === 1
    }
    async findUserByRecoveryCode(recoveryCode: string): Promise<UsersAcountDBType | null> {
        return UserModelClass.findOne({'emailRecovery.recoveryCode': recoveryCode})
    }
    async updateRecovery(_id: ObjectId, passwordHash: string): Promise<boolean> {
        const result = await UserModelClass.updateOne({_id: _id}, {
            $set: {
                'accountData.passwordHash': passwordHash,
                'emailRecovery.isConfirmation': true
            }
        })
        return result.modifiedCount === 1
    }

}

export const usersRepositories = new UsersRepositories()