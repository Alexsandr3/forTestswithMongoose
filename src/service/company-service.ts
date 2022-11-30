import bcrypt from "bcrypt"
import {EmailService} from "./mail-service";
import {CompanyRepositories} from "../repositories/company-repositories";
import {ApiErrors} from "../exceptions/api-errors";
import {
    ShortEmailConfirmationType,
    ShortEmailRecoveryType,
    CompanyAcountDBType
} from "../types/company-type";
import {JwtService} from "./jwt-service";
import {DeviceRepositories} from "../repositories/device-repositories";
import {TokensType} from "../types/token-type";
import {CompanyDto} from "../dtos/company-dto";
import {PayloadDTO} from "../dtos/payload-dto";
import add from "date-fns/add";
import {randomUUID} from "crypto";


export class CompanyService {
    constructor(protected emailService: EmailService,
                protected companyRepositories: CompanyRepositories,
                protected jwtService: JwtService,
                protected deviceRepositories: DeviceRepositories) {
    }

    async registration(nameCompany: string, login: string, email: string, password: string): Promise<CompanyAcountDBType | null> {
        const isValidCompany = await this.companyRepositories.findCompany(login)
        if (!isValidCompany) throw ApiErrors.BAD_REQUEST_400(`Company with this email or login is already registered `)
        const passwordHash = await bcrypt.hash(password, 10)
        const company: CompanyAcountDBType = await this.companyRepositories.registration(nameCompany, login, email, passwordHash)
        const sendEmail = await this.emailService.sendEmailConfirmation(company.accountData.email, company.emailConfirmation.confirmationCode)
        if (!sendEmail) throw ApiErrors.INTERNET_SERVER_ERROR(`I can't message Email`)
        return company
    }

    async _checkFoundCompany(company: CompanyAcountDBType, code: string) {
        if (company.emailConfirmation.isConfirmation) throw ApiErrors.BAD_REQUEST_400(`Code has confirmation already`)
        if (company.emailConfirmation.confirmationCode !== code) throw ApiErrors.BAD_REQUEST_400(`Company is not confirmed`)
        if (company.emailConfirmation.expirationDate < new Date()) throw ApiErrors.BAD_REQUEST_400(`Confirmation has expired`)
        return company

    }

    async confirmation(code: string): Promise<boolean> {
        const company = await this.companyRepositories.findCompanyByCode(code)
        if (!company) throw ApiErrors.BAD_REQUEST_400(`Invalid code or you are already registered`)
        await this._checkFoundCompany(company, code)
        return await this.companyRepositories.updateStatusCodeConfirmation(company._id)
    }

    async login(login: string, password: string, ipAddress: string, deviceName: string): Promise<TokensType> {
        const company = await this.companyRepositories.findByName(login)
        if (!company) throw ApiErrors.UNAUTHORIZED_401(`Company with this name is not authorized `)
        const comparison = await bcrypt.compare(password, company.accountData.passwordHash)
        if (!comparison) throw ApiErrors.UNAUTHORIZED_401(`Incorrect password`)
        const companyDto = new CompanyDto(company)
        const token = await this.jwtService.generateTokens({...companyDto})
        const payload = await this.jwtService.verifyToken(token.refreshToken)
        const payloadDto = new PayloadDTO(payload)
        await this.deviceRepositories.createDevice(companyDto, ipAddress, deviceName, payloadDto)
        return token
    }

    async _checkRefreshTokena(refreshToken: string) {
        if (!refreshToken) throw ApiErrors.UNAUTHORIZED_401(`Did not come refreshToken`)
        const payload = await this.jwtService.verifyToken(refreshToken)
        if (!payload) throw ApiErrors.UNAUTHORIZED_401(`Company with id not authorized`)
        const payloadDto = new PayloadDTO(payload)
        if (payloadDto.exp < new Date().toISOString()) throw ApiErrors.UNAUTHORIZED_401(`Expired date`)
        const deviceUser = await this.deviceRepositories.findDeviceForValid(payloadDto)
        if (!deviceUser) throw ApiErrors.UNAUTHORIZED_401(`Incorrect userId or deviceId or issuedAt`)
        return payloadDto
    }

    async refreshToken(refreshToken: string) {
        const payloadDto = await this._checkRefreshTokena(refreshToken)
        const newTokens = await this.jwtService.generateTokens(payloadDto)
        const payloadNew = await this.jwtService.verifyToken(newTokens.refreshToken)
        const mewPayloadDto = new PayloadDTO(payloadNew)
        const updateDevice = await this.deviceRepositories.updateDateDevice(mewPayloadDto, payloadDto.iat)
        if (!updateDevice) throw ApiErrors.UNAUTHORIZED_401(`Update failed!`)
        return newTokens
    }

    async _findCompany(email: string) {
        const company = await this.companyRepositories.findByName(email)
        if (!company) throw ApiErrors.BAD_REQUEST_400(`Incorrect email or login`)
        if (company.emailConfirmation.isConfirmation) throw ApiErrors.BAD_REQUEST_400(`Company already has confirmation`)
        if (company.emailConfirmation.expirationDate < new Date()) throw ApiErrors.BAD_REQUEST_400(`Confirmation has expired`)
        return company
    }

    async resending(email: string) {
        const company = await this._findCompany(email)
        const codeResending = new ShortEmailConfirmationType(
            randomUUID(),
            add(new Date(), {hours: 1})
        )
        const newCompany = await this.companyRepositories.updateCodeConfirmation(company._id, codeResending.confirmationCode, codeResending.expirationDate)
        const sendEmail = await this.emailService.sendEmailConfirmation(company.accountData.email, company.emailConfirmation.confirmationCode)
        if (!sendEmail) throw ApiErrors.INTERNET_SERVER_ERROR(`I can't message Email`)
        return newCompany
    }

    async recovery(email: string) {
        const company = await this._findCompany(email)
        const codeRecovery = new ShortEmailRecoveryType(
            randomUUID(),
            add(new Date(), {hours: 1})
        )
        const newCompany = await this.companyRepositories.updateCodeRecovery(company._id, codeRecovery.recoveryCode, codeRecovery.expirationDate)
        const sendEmail = await this.emailService.sendPasswordRecoveryMessage(company.accountData.email, company.emailConfirmation.confirmationCode)
        if (!sendEmail) throw ApiErrors.INTERNET_SERVER_ERROR(`I can't message Email`)
        return newCompany
    }

    async newPassword(newPassword: string, recoveryCode: string) {
        const company = await this.companyRepositories.findUserByRecoveryCode(recoveryCode)
        if (!company) throw ApiErrors.BAD_REQUEST_400(`Invalid recoveryCode or you are already registered`)
        await this._checkFoundCompany(company, recoveryCode)
        const passwordHash = await bcrypt.hash(newPassword, 10)
        return await this.companyRepositories.updateRecovery(company._id, passwordHash)
    }

    async logout(refreshToken: string): Promise<boolean> {
        const payloadDto = await this._checkRefreshTokena(refreshToken)
        const device = await this.deviceRepositories.findDeviceForDelete(payloadDto)
        if (!device) throw ApiErrors.UNAUTHORIZED_401(`Incorrect userId or deviceId or issuedAt`)
        const isDeleted = await this.deviceRepositories.deleteDevice(payloadDto)
        if (!isDeleted) throw ApiErrors.UNAUTHORIZED_401(`Unauthorized`)
        return true
    }
}

