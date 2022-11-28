import {CompanyAcountDBType} from "../types/company-type";
import {AdminRepositories} from "../repositories/admin-repositories";
import {ApiErrors} from "../exceptions/api-errors";
import {ObjectId} from "mongodb";


export class AdminService {
    constructor(
        protected adminRepositories: AdminRepositories) {
    }

    async findComapny(companyId: string): Promise<CompanyAcountDBType> {
        if (!ObjectId.isValid(companyId)) throw ApiErrors.NOT_FOUND_404(`Incorrect id,  please enter a valid one`)
        const company = await this.adminRepositories.findComapny(companyId)
        if (!company) throw ApiErrors.NOT_FOUND_404(`Not found`)
        return company
    }

    async updateDeposit(deposit: number, companyId: string): Promise<boolean> {
        if (!ObjectId.isValid(companyId)) throw ApiErrors.NOT_FOUND_404(`Incorrect id,  please enter a valid one`)
        const result = await this.adminRepositories.updateDeposit(deposit, companyId)
        if (!result) throw ApiErrors.NOT_FOUND_404(`Not found`)
        return result

    }
}

