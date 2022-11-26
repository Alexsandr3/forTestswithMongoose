import {CompanyAcountDBType} from "../types/company-type";
import {randomUUID} from "crypto";

export class CompanyDto {
    companyId;
    deviceId = randomUUID()
    constructor(model: CompanyAcountDBType) {
        this.companyId = model._id;
    }
}

