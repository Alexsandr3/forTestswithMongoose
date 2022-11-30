export class TokensType {
    constructor(public accessToken: string,
                public refreshToken: string) {
    }
}


export class AccessTokenAdmin {
    constructor(
        public adminId: string,
        public rol: string,
        public iat: number,
        public exp: number
    ) {
    }
}

export class RefreshTokenAdmin {
    constructor(
        public adminId: string,
        public rol: string,
        public deviceId: string,
        public iat: number,
        public exp: number
    ) {
    }
}