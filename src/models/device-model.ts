import mongoose from "mongoose";
import {ObjectId} from "mongodb";

const deviceSchema = new mongoose.Schema({
    _id: ObjectId,
    userId: {type: String, required: true},
    ip: {type: String, required: true},
    titleHttp: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
    expiredDate: {type: String, required: true},
    deviceId: {type: String, required: true}
});

export const DeviceModelClass = mongoose.model('device', deviceSchema);