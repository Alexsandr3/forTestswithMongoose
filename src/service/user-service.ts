import bcrypt from "bcrypt"
import {emailService} from "./mail-service";
import {usersRepositories} from "../repositories/user-repositories";
import {ApiErrors} from "../exceptions/api-errors";
import {UsersAcountDBType} from "../types/user-type";
import {jwtService} from "./jwt-service";
import {deviceRepositories} from "../repositories/device-repositories";
import {TokensType} from "../types/token-type";
import {UserDto} from "../dtos/user-dto";


class UserService {
    async registration(nameCompany: string, login: string, email: string, password: string): Promise<UsersAcountDBType | null> {
        const isValidCompany = await usersRepositories.findCompany(login)
        if (!isValidCompany) throw ApiErrors.BAD_REQUEST_400(`${nameCompany} already in use, do you need choose new name company`)
        const passwordHash = await bcrypt.hash(password, 10)
        const user = await usersRepositories.registration(nameCompany, login, email, passwordHash)
        await emailService.sendEmailConfirmation(user.accountData.email, user.emailConfirmation.confirmationCode)
        console.log('registra -- user', user)
        return user
    }

    async confirmation(code: string): Promise<boolean> {
        const user = await usersRepositories.findCompanyByCode(code)
        if (!user) throw ApiErrors.BAD_REQUEST_400(`Invalid code or you are already registered`)
        if (user.emailConfirmation.isConfirmation) throw ApiErrors.BAD_REQUEST_400(`Code has confirmation already`)
        if (user.emailConfirmation.confirmationCode !== code) throw ApiErrors.BAD_REQUEST_400(`User is not confirmed`)
        if (user.emailConfirmation.expirationDate < new Date()) throw ApiErrors.BAD_REQUEST_400(`Confirmation has expired`)
        return await usersRepositories.updateCodeConfirmation(user._id)
    }

    async login(login: string, password: string, ipAddress: string, deviceName: string):Promise<TokensType> {
        const user = await usersRepositories.findByName(login)
        if (!user) throw ApiErrors.UNAUTHORIZED_401()
        const comparison = await bcrypt.compare(password, user.accountData.passwordHash)
        if (!comparison) throw ApiErrors.UNAUTHORIZED_401()
        const userDto = new UserDto(user)
        const token = await jwtService.generateTokens({...userDto})
        const payload = await jwtService.verifyToken(token.refreshToken)
        await deviceRepositories.createDevice(userDto, ipAddress, deviceName, payload.exp, payload.iat)
        return token
    }
}

export const userService = new UserService()