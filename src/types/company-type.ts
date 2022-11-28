import {ObjectId} from "mongodb";

export class CompanyAcountDBType {
    constructor(public _id: ObjectId,
                public accountData: AccountDataType,
                public emailConfirmation: EmailConfirmationType,
                public emailRecovery: EmailRecoveryType,
                public wallet: WalletCompanyDBType) {
    }
}

export class EmailConfirmationType {
    constructor(
        public confirmationCode: string,
        public expirationDate: Date,
        public isConfirmation: boolean) {
    }
}

export class EmailRecoveryType {
    constructor(
        public recoveryCode: string,
        public expirationDate: Date,
        public isConfirmation: boolean) {
    }
}

export class AccountDataType {
    constructor(
        public companyName: string,
        public login: string,
        public email: string,
        public passwordHash: string,
        public createdAt: string) {
    }
}

export class ShortEmailConfirmationType {
    constructor(
        public confirmationCode: string,
        public expirationDate: Date) {
    }
}

export class ShortEmailRecoveryType {
    constructor(
        public recoveryCode: string,
        public expirationDate: Date) {
    }
}

export class WalletCompanyDBType {
    constructor(
        public deposit: number,
        public statusActivations: string
    ) {
    }
}

export enum StatusActivations {
    active = "active",
    deactivated = "deactivated"
}