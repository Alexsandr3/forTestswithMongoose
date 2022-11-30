import {ObjectId} from "mongodb";

export class AdminDeviceDBType {
    constructor(public _id: ObjectId,
                public adminId: string,
                public rol: string,
                public ip: string,
                public titleHttp: string,
                public lastActiveDate: string,
                public expiredDate: string,
                public deviceId: string) {
    }
}


export class AdminDBType {
    constructor(public _id: ObjectId,
                public rol: string,
                public login: string,
                public passwordHash: string,
                public createdAt: string) {
    }
}


export enum RolAdmin {
    admin = "admin",
    superAdmin = "superAdmin",
    admin2 = "admin2"
}