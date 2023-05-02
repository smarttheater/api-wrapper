"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionError = exports.APIError = exports.BadRequestError = exports.UnauthorizedError = exports.PassportError = exports.ErrorName = void 0;
const http_status_1 = require("http-status");
var ErrorName;
(function (ErrorName) {
    ErrorName["api"] = "API";
    ErrorName["passport"] = "Passport";
    ErrorName["unauthorized"] = "Unauthorized";
    ErrorName["badRequest"] = "BadRequest";
    ErrorName["exception"] = "Passport";
})(ErrorName = exports.ErrorName || (exports.ErrorName = {}));
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
class APIError extends Error {
    constructor(error, log) {
        super(`${error.message}`);
        this.error = error;
        this.log = log;
        this.status = error.code;
    }
}
exports.APIError = APIError;
class ExceptionError extends Error {
    constructor(message, log) {
        super(`Exception Error Message: ${message}`);
        this.message = message;
        this.log = log;
        this.status = http_status_1.INTERNAL_SERVER_ERROR;
    }
}
exports.ExceptionError = ExceptionError;
