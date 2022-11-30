import {AdminRepositories} from "../repositories/admin-repositories";
import {ApiErrors} from "../exceptions/api-errors";
import {ObjectId} from "mongodb";
import {CompanyViewDtoModel} from "../models/companyViewModel";
import {TokensType} from "../types/token-type";
import bcrypt from "bcrypt";
import {PayloadAdminDTO} from "../dtos/payload-dto";
import {AdminDto} from "../dtos/admin-dto";
import {JwtService} from "./jwt-service";
import {AdminDBType} from "../types/admin-type";


export class AdminService {
    constructor(
        protected adminRepositories: AdminRepositories,
        protected jwtService: JwtService) {
    }

    async loginAdmin(login: string, password: string, ipAddress: string, deviceName: string): Promise<TokensType> {
        const company = await this.adminRepositories.findByAdmin(login)
        if (!company) throw ApiErrors.UNAUTHORIZED_401(`Admin with this name is not authorized `)
        const compare = await bcrypt.compare(password, company.passwordHash)
        if (!compare) throw ApiErrors.UNAUTHORIZED_401(`Incorrect password`)
        const adminDto = new AdminDto(company)
        const token = await this.jwtService.generateTokensForAdmin({...adminDto})
        const payload = await this.jwtService.verifyTokenAdmin(token.refreshToken)
        const payloadDto = new PayloadAdminDTO(payload)
        await this.adminRepositories.createAdminDevice(adminDto, ipAddress, deviceName, payloadDto)
        return token
    }

    async registrationAdmin(login: string, password: string): Promise<AdminDBType | null> {
        const isValidCompany = await this.adminRepositories.findByAdmin(login)
        if (isValidCompany) throw ApiErrors.BAD_REQUEST_400(`Admin with this login is already at home :-))))`)
        const passwordHash = await bcrypt.hash(password, 10)
        return await this.adminRepositories.registrationAdmin(login, passwordHash)
    }

    async _checkRefreshTokena(refreshToken: string) {
        if (!refreshToken) throw ApiErrors.UNAUTHORIZED_401(`Did not come refreshToken`)
        const payload = await this.jwtService.verifyTokenAdmin(refreshToken)
        if (!payload) throw ApiErrors.UNAUTHORIZED_401(`Admin with id not authorized`)
        const payloadDto = new PayloadAdminDTO(payload)
        if (payloadDto.exp < new Date().toISOString()) throw ApiErrors.UNAUTHORIZED_401(`Expired date`)
        const deviceAdmin = await this.adminRepositories.findDeviceAdminForValid(payloadDto)
        if (!deviceAdmin) throw ApiErrors.UNAUTHORIZED_401(`Incorrect id or deviceId or issuedAt`)
        return payloadDto
    }

    async refreshToken(refreshToken: string) {
        const payloadDto = await this._checkRefreshTokena(refreshToken)
        const newTokens = await this.jwtService.generateTokensForAdmin(payloadDto)
        const payloadNew = await this.jwtService.verifyTokenAdmin(newTokens.refreshToken)
        const mewPayloadDto = new PayloadAdminDTO(payloadNew)
        const updateDevice = await this.adminRepositories.updateDateDeviceAdmin(mewPayloadDto, payloadDto.iat)
        if (!updateDevice) throw ApiErrors.UNAUTHORIZED_401(`Update failed!`)
        return newTokens
    }

    async findCompany(companyId: string): Promise<CompanyViewDtoModel> {
        if (!ObjectId.isValid(companyId)) throw ApiErrors.NOT_FOUND_404(`Incorrect id,  please enter a valid one`)
        const company = await this.adminRepositories.findCompany(companyId)
        if (!company) throw ApiErrors.NOT_FOUND_404(`Not found`)
        return company
    }

    async deleteCompany(companyId: string): Promise<boolean> {
        if (!ObjectId.isValid(companyId)) throw ApiErrors.NOT_FOUND_404(`Incorrect id,  please enter a valid one`)
        const result = await this.adminRepositories.deleteCompany(companyId)
        if (!result) throw ApiErrors.NOT_FOUND_404(`Not found`)
        return true
    }

    async updateDeposit(deposit: number, companyId: string): Promise<boolean> {
        if (!ObjectId.isValid(companyId)) throw ApiErrors.NOT_FOUND_404(`Incorrect id,  please enter a valid one`)
        const result = await this.adminRepositories.updateDeposit(deposit, companyId)
        if (!result) throw ApiErrors.NOT_FOUND_404(`Not found`)
        return result

    }
}

