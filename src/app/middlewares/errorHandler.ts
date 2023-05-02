import { Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import { IErrors } from '../models/error';

export function errorHandler(err: IErrors, _req: Request, res: Response) {
    const status =
        err.status === undefined ? INTERNAL_SERVER_ERROR : err.status;
    res.status(status).json({
        message: err.message,
    });
}
