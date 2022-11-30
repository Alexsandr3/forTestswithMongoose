import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {TokensType} from "../types/token-type";
import {CompanyDto} from "../dtos/company-dto";
import {PayloadDTO} from "../dtos/payload-dto";
import {AdminDto} from "../dtos/admin-dto";

export class JwtService {
    async generateTokens(companyDto: CompanyDto | PayloadDTO): Promise<TokensType> {
        const accessToken = jwt.sign({companyId: companyDto.companyId}, settings.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign({companyId: companyDto.companyId, deviceId: companyDto.deviceId}, settings.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
        return new TokensType(accessToken, refreshToken)
    }
    async generateTokensForAdmin(adminDto: AdminDto): Promise<TokensType> {
        const accessToken = jwt.sign({adminId: adminDto.adminId, rol: adminDto.rol}, settings.ACCESS_TOKEN_SECRET_ADMIN, {expiresIn: '5m'})
        const refreshToken = jwt.sign({adminId: adminDto.adminId, rol: adminDto.rol, deviceId: adminDto.deviceId}, settings.REFRESH_TOKEN_SECRET_ADMIN, {expiresIn: '3h'})
        return new TokensType(accessToken, refreshToken)
    }

    async verifyToken(refreshToken: string) {
        try {
            const result: any = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET)
            return result
        } catch (error) {
            return false
        }
    }
    async verifyTokenAdmin(refreshToken: string) {
        try {
            const result: any  = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET_ADMIN)
            return result
        } catch (error) {
            return false
        }
    }

    async getAdminByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.ACCESS_TOKEN_SECRET_ADMIN)
            return result
        } catch (error) {
            return false
        }
    }
}



