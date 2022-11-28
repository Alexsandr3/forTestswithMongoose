import {CompanyModelClass} from "../models/schemas/company-schema";
import {CompanyViewDtoModel} from "../models/companyViewModel";


export class AdminQueryRepositories {


    async getCompanies(): Promise<CompanyViewDtoModel[]>{
        const companies = await CompanyModelClass.find().lean()
        const mappedCompanies = companies.map(async company => await new CompanyViewDtoModel(company))
        const itemsLikes = await Promise.all(mappedCompanies)
        return itemsLikes
    }
}


