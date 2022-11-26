

export class ApiErrors extends Error {
    status;
    errors;
    constructor(status: number, message: string, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;

    }
    static UNAUTHORIZED_401(){
        return new ApiErrors(401, "User unauthorized")
    }

    static BAD_REQUEST_400(message: string, errors = []) {
        return new ApiErrors(400, message, errors)
    }
}





export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    NOT_FOUND_404: 404,
    TOO_MUCH_REQUESTS_429: 429,

    INTERNET_SERVER_ERROR: 500
}