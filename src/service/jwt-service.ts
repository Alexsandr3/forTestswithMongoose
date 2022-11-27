import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {TokensType} from "../types/token-type";
import {CompanyDto} from "../dtos/company-dto";
import {PayloadDto} from "../dtos/payload-dto";

export class JwtService {
    async generateTokens(companyDto: CompanyDto | PayloadDto): Promise<TokensType> {
        const accessToken = jwt.sign({companyId: companyDto.companyId}, settings.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
        const refreshToken = jwt.sign({companyId: companyDto.companyId, deviceId: companyDto.deviceId}, settings.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
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



