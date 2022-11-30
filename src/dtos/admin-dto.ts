import {randomUUID} from "crypto";
import {AdminDBType} from "../types/admin-type";

export class AdminDto {
    adminId;
    rol;
    deviceId = randomUUID()
    constructor(model: AdminDBType) {
        this.adminId = model._id.toString()
        this.rol = model.rol;
    }

}


