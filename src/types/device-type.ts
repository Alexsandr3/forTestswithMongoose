import {ObjectId} from "mongodb";

export class DeviceDBType {
    constructor(public _id: ObjectId,
                public userId: string,
                public ip: string,
                public titleHttp: string,
                public lastActiveDate: string,
                public expiredDate: string,
                public deviceId: string) {
    }
}