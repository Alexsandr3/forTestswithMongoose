import {DeviceDBType} from "../types/device-type";
import {DeviceModelClass} from "../models/device-model";
import {ObjectId} from "mongodb";
import {UserDto} from "../dtos/user-dto";
import {PayloadDto} from "../dtos/payload-dto";

class DeviceRepositories {
    async createDevice(userDto: UserDto, ipAddress: string, deviceName: string, payloadDto: PayloadDto): Promise<DeviceDBType> {

        const newDevice = new DeviceDBType(
            new ObjectId(),
            userDto.userId.toString(),
            ipAddress,
            deviceName,
            payloadDto.iat,
            payloadDto.exp,
            userDto.deviceId)
        await DeviceModelClass.create(newDevice)
        return newDevice
    }

    async findDeviceForValid(payloadDto: PayloadDto): Promise<DeviceDBType | null> {
        return  DeviceModelClass
            .findOne({
                $and: [
                    {userId: payloadDto.userId},
                    {deviceId: payloadDto.deviceId},
                    {lastActiveDate: payloadDto.iat},
                ]
            })

    }
    async updateDateDevice(payload: PayloadDto, oldIat: string): Promise<boolean> {
        const result = await DeviceModelClass.updateOne({
            $and: [
                {userId: {$eq: payload.userId}},
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

export const deviceRepositories = new DeviceRepositories()