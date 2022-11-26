import {UsersAcountDBType} from "../types/user-type";
import {randomUUID} from "crypto";

export class UserDto {
    userId;
    deviceId = randomUUID()
    constructor(model: UsersAcountDBType) {
        this.userId = model._id;
    }
}

