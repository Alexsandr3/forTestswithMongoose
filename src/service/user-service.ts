import bcrypt from "bcrypt"
import {emailService} from "./mail-service";
import {usersRepositories} from "../repositories/user-repositories";
import {ApiErrors} from "../exceptions/api-errors";
import {
    ShortEmailConfirmationType,
    ShortEmailRecoveryType,
    UsersAcountDBType
} from "../types/user-type";
import {jwtService} from "./jwt-service";
import {deviceRepositories} from "../repositories/device-repositories";
import {TokensType} from "../types/token-type";
import {UserDto} from "../dtos/user-dto";
import {PayloadDto} from "../dtos/payload-dto";
import add from "date-fns/add";
import {randomUUID} from "crypto";


class UserService {
    async registration(nameCompany: string, login: string, email: string, password: string): Promise<UsersAcountDBType | null> {
        const isValidCompany = await usersRepositories.findCompany(login)
        if (!isValidCompany) throw ApiErrors.BAD_REQUEST_400(`${login} or ${email} already in use!`)
        const passwordHash = await bcrypt.hash(password, 10)
        const user = await usersRepositories.registration(nameCompany, login, email, passwordHash)
        const sendEmail = await emailService.sendEmailConfirmation(user.accountData.email, user.emailConfirmation.confirmationCode)
        if (!sendEmail) throw ApiErrors.INTERNET_SERVER_ERROR(`I can't message Email`)
        return user
    }

    async confirmation(code: string): Promise<boolean> {
        console.log(code)
        const user = await usersRepositories.findCompanyByCode(code)
        if (!user) throw ApiErrors.BAD_REQUEST_400(`Invalid code or you are already registered`)
        if (user.emailConfirmation.isConfirmation) throw ApiErrors.BAD_REQUEST_400(`Code has confirmation already`)
        if (user.emailConfirmation.confirmationCode !== code) throw ApiErrors.BAD_REQUEST_400(`User is not confirmed`)
        if (user.emailConfirmation.expirationDate < new Date()) throw ApiErrors.BAD_REQUEST_400(`Confirmation has expired`)
        return await usersRepositories.updateStatusCodeConfirmation(user._id)
    }

    async login(login: string, password: string, ipAddress: string, deviceName: string): Promise<TokensType> {
        const user = await usersRepositories.findByName(login)
        if (!user) throw ApiErrors.UNAUTHORIZED_401(`Company with this name is not authorized `)
        const comparison = await bcrypt.compare(password, user.accountData.passwordHash)
        if (!comparison) throw ApiErrors.UNAUTHORIZED_401(`Incorrect password`)
        const userDto = new UserDto(user)
        const token = await jwtService.generateTokens({...userDto})
        const payload = await jwtService.verifyToken(token.refreshToken)
        const payloadDto = new PayloadDto(payload)
        await deviceRepositories.createDevice(userDto, ipAddress, deviceName, payloadDto)
        return token
    }

    async refreshToken(payloadDto: PayloadDto) {
        const newTokens = await jwtService.generateTokens(payloadDto)
        const payloadNew = await jwtService.verifyToken(newTokens.refreshToken)
        const mewPayloadDto = new PayloadDto(payloadNew)
        const updateDevice = await deviceRepositories.updateDateDevice(mewPayloadDto, payloadDto.iat)
        if (!updateDevice) throw ApiErrors.UNAUTHORIZED_401(`Update failed!`)
        return newTokens
    }

    async resending(email: string) {
        const user = await usersRepositories.findByName(email)
        if (!user) throw ApiErrors.BAD_REQUEST_400(`Incorrect email or login`)
        if (user.emailConfirmation.isConfirmation) throw ApiErrors.BAD_REQUEST_400(`User already has confirmation`)
        if (user.emailConfirmation.expirationDate < new Date()) throw ApiErrors.BAD_REQUEST_400(`Confirmation has expired`)
        const codeResending = new ShortEmailConfirmationType(
            randomUUID(),
            add(new Date(), {hours: 1})
        )
        const newUser = await usersRepositories.updateCodeConfirmation(user._id, codeResending.confirmationCode, codeResending.expirationDate)
        const sendEmail = await emailService.sendEmailConfirmation(user.accountData.email, user.emailConfirmation.confirmationCode)
        if (!sendEmail) throw ApiErrors.INTERNET_SERVER_ERROR(`I can't message Email`)
        return newUser
    }


    async recovery(email: string) {
        const user = await usersRepositories.findByName(email)
        if (!user) throw ApiErrors.BAD_REQUEST_400(`Incorrect email or login`)
        if (user.emailConfirmation.isConfirmation) throw ApiErrors.BAD_REQUEST_400(`User already has confirmation`)
        if (user.emailConfirmation.expirationDate < new Date()) throw ApiErrors.BAD_REQUEST_400(`Confirmation has expired`)
        const codeRecovery = new ShortEmailRecoveryType(
            randomUUID(),
            add(new Date(), {hours: 1})
        )
        const newUser = await usersRepositories.updateCodeRecovery(user._id, codeRecovery.recoveryCode, codeRecovery.expirationDate)
        const sendEmail = await emailService.sendPasswordRecoveryMessage(user.accountData.email, user.emailConfirmation.confirmationCode)
        if (!sendEmail) throw ApiErrors.INTERNET_SERVER_ERROR(`I can't message Email`)
        return newUser
    }


    async newPassword(newPassword: string, recoveryCode: string) {
        const user = await usersRepositories.findUserByRecoveryCode(recoveryCode)
        if (!user) throw ApiErrors.BAD_REQUEST_400(`Invalid recoveryCode or you are already registered`)
        if (user.emailConfirmation.isConfirmation) throw ApiErrors.BAD_REQUEST_400(`User already has confirmation`)
        if (user.emailRecovery.recoveryCode !== recoveryCode) throw ApiErrors.BAD_REQUEST_400(`User already has confirmation`)
        if (user.emailConfirmation.expirationDate < new Date()) throw ApiErrors.BAD_REQUEST_400(`-Confirmation has expired`)
        const passwordHash = await bcrypt.hash(newPassword, 10)
        return await usersRepositories.updateRecovery(user._id, passwordHash)
    }
}

export const userService = new UserService()