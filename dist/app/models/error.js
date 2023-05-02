"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.UnauthorizedError = exports.PassportError = void 0;
const http_status_1 = require("http-status");
class PassportError extends Error {
    constructor(response) {
        super(`Passport Error Response: ${response.status} ${response.statusText}`);
        this.response = response;
        this.response = response;
        this.status = response.status;
    }
}
exports.PassportError = PassportError;
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.status = http_status_1.UNAUTHORIZED;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class BadRequestError extends Error {
    constructor(validationError) {
        super(JSON.stringify(validationError));
        this.status = http_status_1.BAD_REQUEST;
    }
}
exports.BadRequestError = BadRequestError;
