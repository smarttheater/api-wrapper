import { ValidationError } from 'express-validator';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status';
import { Response } from 'node-fetch';

export type IErrors =
    | PassportError
    | UnauthorizedError
    | BadRequestError
    | BadRequestError
    | APIError
    | ExceptionError;

export enum ErrorName {
    api = 'API',
    passport = 'Passport',
    unauthorized = 'Unauthorized',
    badRequest = 'BadRequest',
    exception = 'Passport',
}

export class PassportError extends Error {
    public name: ErrorName.passport;
    public status: number;
    constructor(public response: Response) {
        super(
            `Passport Error Response: ${response.status} ${response.statusText}`
        );
        this.response = response;
        this.status = response.status;
    }
}

export class UnauthorizedError extends Error {
    public name: ErrorName.unauthorized;
    public status: number;
    constructor(message: string) {
        super(message);
        this.status = UNAUTHORIZED;
    }
}

export class BadRequestError extends Error {
    public name: ErrorName.badRequest;
    public status: number;
    constructor(validationError: ValidationError[]) {
        super(JSON.stringify(validationError));
        this.status = BAD_REQUEST;
    }
}

export class APIError extends Error {
    public name: ErrorName.api;
    public status: number;
    constructor(
        public error: {
            code: number;
            errors: { message: string; name: string; reason: string }[];
            message: string;
        },
        public log?: log.data
    ) {
        super(`${error.message}`);
        this.status = error.code;
    }
}

export class ExceptionError extends Error {
    public name: ErrorName.exception;
    public status: number;
    constructor(public message: string, public log?: log.data) {
        super(`Exception Error Message: ${message}`);
        this.status = INTERNAL_SERVER_ERROR;
    }
}
