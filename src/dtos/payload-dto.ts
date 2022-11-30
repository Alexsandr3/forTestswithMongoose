import {RefreshTokenAdmin} from "../types/token-type";

export class PayloadDTO {
    companyId: string;
    deviceId: string;
    iat: string;
    exp: string;
    constructor(model: PayloadType) {
        this.companyId = model.companyId;
        this.deviceId = model.deviceId;
        this.iat = (new Date(model.iat * 1000)).toISOString();
        this.exp = (new Date(model.exp * 1000)).toISOString();
    }
}


export class PayloadAdminDTO {
    adminId: string;
    rol: string;
    deviceId: string;
    iat: string;
    exp: string;
    constructor(model: RefreshTokenAdmin) {
        this.adminId = model.adminId;
        this.rol = model.rol;
        this.deviceId = model.deviceId;
        this.iat = (new Date(model.iat * 1000)).toISOString();
        this.exp = (new Date(model.exp * 1000)).toISOString();
    }
}

export class PayloadDtoAdmin {
    adminId: string;
    login: string;
    passwordHash: string;
    deviceId: string;
    iat: string;
    exp: string;
    constructor(model: PayloadAdminType) {
        this.adminId = model.adminId;
        this.login = model.passwordHash;
        this.passwordHash = model.passwordHash;
        this.deviceId = model.deviceId;
        this.iat = (new Date(model.iat * 1000)).toISOString();
        this.exp = (new Date(model.exp * 1000)).toISOString();
    }
}


export class PayloadType {
    constructor(
        public companyId: string,
        public deviceId: string,
        public iat: number,
        public exp: number
    ) {
    }
}

export class PayloadAdminType {
    constructor(
        public adminId: string,
        public login: string,
        public passwordHash: string,
        public deviceId: string,
        public iat: number,
        public exp: number
    ) {
    }
}