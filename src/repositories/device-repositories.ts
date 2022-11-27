import {DeviceDBType} from "../types/device-type";
import {DeviceModelClass} from "../models/device-model";
import {ObjectId} from "mongodb";
import {CompanyDto} from "../dtos/company-dto";
import {PayloadDto} from "../dtos/payload-dto";

export class DeviceRepositories {
    async createDevice(companyDto: CompanyDto, ipAddress: string, deviceName: string, payloadDto: PayloadDto): Promise<DeviceDBType> {

        const newDevice = new DeviceDBType(
            new ObjectId(),
            companyDto.companyId.toString(),
            ipAddress,
            deviceName,
            payloadDto.iat,
            payloadDto.exp,
            companyDto.deviceId)
        await DeviceModelClass.create(newDevice)
        return newDevice
    }

    async findDeviceForValid(payloadDto: PayloadDto): Promise<DeviceDBType | null> {
        return  DeviceModelClass
            .findOne({
                $and: [
                    {companyId: payloadDto.companyId},
                    {deviceId: payloadDto.deviceId},
                    {lastActiveDate: payloadDto.iat},
                ]
            })

    }
    async updateDateDevice(payload: PayloadDto, oldIat: string): Promise<boolean> {
        const result = await DeviceModelClass.updateOne({
            $and: [
                {companyId: {$eq: payload.companyId}},
                {deviceId: {$eq: payload.deviceId}},
                {lastActiveDate: {$eq: oldIat}},
            ]
        }, {
            $set: {
                lastActiveDate: payload.iat,
                expiredDate: payload.exp
            }
        })
        return result.modifiedCount === 1
    }

}

