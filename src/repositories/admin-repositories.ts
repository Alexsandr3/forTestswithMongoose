import {CompanyModelClass} from "../models/schemas/company-schema";
import {CompanyAcountDBType, StatusActivations} from "../types/company-type";


export class AdminRepositories {
    async findComapny(companyId: string): Promise<CompanyAcountDBType | null>{
        const company = await CompanyModelClass.findOne({_id: new Object(companyId)})
        if (!company) return null
        return company
    }
    async updateDeposit(deposit: number, companyId: string): Promise<boolean>{
        const company = await CompanyModelClass.findOne({_id: new Object(companyId)})
        if (!company) return false
        if (company.wallet.deposit > 100){
            const result = await CompanyModelClass.updateOne(
                {_id: new Object(companyId)},
                {$set:{"wallet.statusActivations": StatusActivations.deactivated,
                        "wallet.deposit": deposit }})
            return result.matchedCount === 1
        } else {
            const result = await CompanyModelClass.updateOne(
                {_id: new Object(companyId)},
                {$set:{"wallet.statusActivations": StatusActivations.active,
                        "wallet.deposit": deposit }})
            return result.matchedCount === 1
        }
    }

}

