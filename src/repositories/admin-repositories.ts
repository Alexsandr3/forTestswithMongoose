import {CompanyModelClass} from "../models/schemas/company-schema";
import {StatusActivations} from "../types/company-type";
import {CompanyViewDtoModel} from "../models/companyViewModel";


export class AdminRepositories {
    async findComapny(companyId: string): Promise<CompanyViewDtoModel | null>{
        const company = await CompanyModelClass.findOne({_id: new Object(companyId)})
        if (!company) return null
        return new CompanyViewDtoModel(company)
    }
    async deleteComapny(companyId: string): Promise<boolean>{
        const result = await CompanyModelClass.deleteOne({_id: new Object(companyId)})
        return result.deletedCount === 1
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

