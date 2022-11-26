import {ObjectId} from "mongodb";

export class DeviceDBType {
    constructor(public _id: ObjectId,
                public companyId: string,
                public ip: string,
                public titleHttp: string,
                public lastActiveDate: string,
                public expiredDate: string,
                public deviceId: string) {
    }
}