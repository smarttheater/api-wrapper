/**
 * バリデーションミドルウェア
 */
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../models/error';
import { validationResult } from 'express-validator';

export function checkValidation(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new BadRequestError(errors.array()));
        return;
    }
    next();
}
