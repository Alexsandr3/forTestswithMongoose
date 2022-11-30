import mongoose from "mongoose";
import {ObjectId} from "mongodb"
import {AdminDBType, AdminDeviceDBType} from "../../types/admin-type";

const adminDeviceSchema = new mongoose.Schema<AdminDeviceDBType>({
    _id: ObjectId,
    adminId: {type: String, required: true},
    rol: {type: String, required: true},
    ip: {type: String, required: true},
    titleHttp: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
    expiredDate: {type: String, required: true},
    deviceId: {type: String, required: true}
});
const adminSchema = new mongoose.Schema<AdminDBType>({
    _id: ObjectId,
    rol: {type: String, required: true},
    login: {type: String, required: true},
    passwordHash: {type: String, required: true},
    createdAt: {type: String, required: true}
});

export const AdminDeviceModelClass = mongoose.model('deviceAdmin', adminDeviceSchema);
export const AdminModelClass = mongoose.model('admin', adminSchema);
