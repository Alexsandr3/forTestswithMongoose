
export class PayloadDto {
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



export class PayloadType {
    constructor(
        public companyId: string,
        public deviceId: string,
        public iat: number,
        public exp: number
    ) {
    }
}
