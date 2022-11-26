import jwt from 'jsonwebtoken'
import {settings} from "../../settings";
import {TokensType} from "../types/token-type";
import {UserDto} from "../dtos/user-dto";

class JwtService {
    async generateTokens(userDto: UserDto): Promise<TokensType> {
        const accessToken = jwt.sign({userId: userDto.userId}, settings.ACCESS_TOKEN_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign({userId: userDto.deviceId, deviceId: userDto.deviceId}, settings.REFRESH_TOKEN_SECRET, {expiresIn: '30d'})
        return new TokensType(accessToken, refreshToken)
    }

    async verifyToken(refreshToken: string) {
        try {
            const result: any = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET)
            return result
        } catch (error) {
            return error
        }
    }
}

export const jwtService = new JwtService()

