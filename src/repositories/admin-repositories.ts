import {CompanyModelClass} from "../models/schemas/company-schema";
import {StatusActivations} from "../types/company-type";
import {CompanyViewDtoModel} from "../models/companyViewModel";
import {AdminDeviceModelClass, AdminModelClass} from "../models/schemas/admin-schema";
import {PayloadAdminDTO} from "../dtos/payload-dto";
import {ObjectId} from "mongodb";
import {AdminDto} from "../dtos/admin-dto";
import {AdminDBType, AdminDeviceDBType, RolAdmin} from "../types/admin-type";
import {DeviceDBType} from "../types/device-type";


export class AdminRepositories {
    async findByAdmin(login: string) {
        return AdminModelClass.findOne({login: login});
    }

    async createAdminDevice(adminDto: AdminDto, ipAddress: string, deviceName: string, payloadDto: PayloadAdminDTO): Promise<AdminDeviceDBType> {
        const newDeviceAdmin = new AdminDeviceDBType(
            new ObjectId(),
            adminDto.adminId,
            adminDto.rol,
            ipAddress,
            deviceName,
            payloadDto.iat,
            payloadDto.exp,
            payloadDto.deviceId)
        await AdminDeviceModelClass.create(newDeviceAdmin)
        return newDeviceAdmin
    }

    async registrationAdmin(login: string, passwordHash: string): Promise<AdminDBType> {
        const admin = new AdminDBType(
            new ObjectId(),
            RolAdmin.superAdmin,
            login,
            passwordHash,
            new Date().toISOString()
        )
        return await AdminModelClass.create(admin)
    }

    async findDeviceAdminForValid(payloadDto: PayloadAdminDTO): Promise<DeviceDBType | null> {
        return AdminDeviceModelClass
            .findOne({
                $and: [
                    {adminId: payloadDto.adminId},
                    {deviceId: payloadDto.deviceId},
                    {lastActiveDate: payloadDto.iat},
                ]
            })
    }

    async updateDateDeviceAdmin(payload: PayloadAdminDTO, oldIat: string): Promise<boolean> {
        const result = await AdminDeviceModelClass.updateOne(
            {adminId: payload.adminId, deviceId: payload.deviceId, lastActiveDate: oldIat},
            {$set: {lastActiveDate: payload.iat, expiredDate: payload.exp}})
        return result.modifiedCount === 1
    }

    async findCompany(companyId: string): Promise<CompanyViewDtoModel | null> {
        const company = await CompanyModelClass.findOne({_id: new Object(companyId)})
        if (!company) return null
        return new CompanyViewDtoModel(company)
    }

    async deleteCompany(companyId: string): Promise<boolean> {
        const result = await CompanyModelClass.deleteOne({_id: new Object(companyId)})
        return result.deletedCount === 1
    }

    async updateDeposit(deposit: number, companyId: string): Promise<boolean> {
        const company = await CompanyModelClass.findOne({_id: new Object(companyId)})
        if (!company) return false
        if (company.wallet.deposit > 100) {
            const result = await CompanyModelClass.updateOne(
                {_id: new Object(companyId)},
                {
                    $set: {
                        "wallet.statusActivations": StatusActivations.deactivated,
                        "wallet.deposit": deposit
                    }
                })
            return result.matchedCount === 1
        } else {
            const result = await CompanyModelClass.updateOne(
                {_id: new Object(companyId)},
                {
                    $set: {
                        "wallet.statusActivations": StatusActivations.active,
                        "wallet.deposit": deposit
                    }
                })
            return result.matchedCount === 1
        }
    }

    async findAdmin(id: string, rol: string): Promise<AdminDto | null> {
        const admin = await AdminModelClass.findOne({_id: new ObjectId(id), rol: rol})
        if (!admin) {
            return null
        } else {
            return new AdminDto(admin)
        }
    }

}

