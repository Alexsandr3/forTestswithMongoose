import {CompanyAcountDBType} from "../types/company-type";

export class CompanyViewDtoModel {
    companyName;
    email;
    companyId;
    createdAt;
    statusActivations;
    deposit
    constructor(company: CompanyAcountDBType) {
        this.companyName = company.accountData.companyName;
        this.email = company.accountData.email;
        this.companyId = company._id.toString();
        this.createdAt = company.accountData.createdAt;
        this.statusActivations = company.wallet.statusActivations;
        this.deposit = company.wallet.deposit
    }

}


