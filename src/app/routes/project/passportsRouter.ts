import * as express from 'express';
import fetch from 'node-fetch';
import {
    BadRequestError,
    ExceptionError,
    PassportError,
} from '../../models/error';
import { body, validationResult } from 'express-validator';
import { checkValidation } from '../../middlewares/validationHandler';

const passportsRouter = express.Router();

/**
 * パスポート取得
 */
passportsRouter.post(
    '',
    ...[body('scope').not().isEmpty()],
    checkValidation,
    async (req, res, next) => {
        try {
            const { scope } = <{ scope: string }>req.body;
            const waiterServerUrl = <string>process.env.WAITER_SERVER_URL;
            if (waiterServerUrl === undefined || waiterServerUrl === '') {
                res.json({ token: '' });
                return;
            }
            const url = `${waiterServerUrl}/projects/${req.project.id}/passports`;
            const body = { scope };
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                next(new PassportError(response));
                return;
            }
            const result = <{ token: string }>await response.json();
            res.json(result);
        } catch (error) {
            next(new ExceptionError(error?.message));
        }
    }
);

export { passportsRouter };
