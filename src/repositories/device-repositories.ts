import {DeviceDBType} from "../types/device-type";
import {DeviceModelClass} from "../models/device-model";
import {ObjectId} from "mongodb";
import {UserDto} from "../dtos/user-dto";

class DeviceRepositories {
    async createDevice(userDto: UserDto, ipAddress: string, deviceName: string, exp: number, iat: number): Promise<DeviceDBType> {
        const dateCreatedToken = (new Date(iat * 1000)).toISOString();
        const dateExpiredToken = (new Date(exp * 1000)).toISOString();
        const newDevice = new DeviceDBType(
            new ObjectId(),
            userDto.userId.toString(),
            ipAddress,
            deviceName,
            dateCreatedToken,
            dateExpiredToken,
            userDto.deviceId)
        await DeviceModelClass.create(newDevice)
        return newDevice
    }

}

export const deviceRepositories = new DeviceRepositories()