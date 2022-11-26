import {ObjectId} from "mongodb";

export class UsersAcountDBType {
    constructor(public _id: ObjectId,
                public accountData: AccountDataType,
                public emailConfirmation: EmailConfirmationType,
                public emailRecovery: EmailRecoveryType) {
    }
}

export class EmailConfirmationType {
    constructor(public confirmationCode: string,
                public expirationDate: Date,
                public isConfirmation: boolean) {
    }
}

export class EmailRecoveryType {
    constructor(public recoveryCode: string,
                public expirationDate: Date,
                public isConfirmation: boolean) {
    }
}

export class AccountDataType {
    constructor(
        public nameCompany: string,
        public login: string,
        public email: string,
        public passwordHash: string,
        public createdAt: string) {
    }
}

export class ShortEmailConfirmationType {
    constructor(public confirmationCode: string,
                public expirationDate: Date) {
    }
}

export class ShortEmailRecoveryType {
    constructor(public recoveryCode: string,
                public expirationDate: Date) {
    }
}