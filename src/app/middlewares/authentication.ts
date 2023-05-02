/**
 * 認証ミドルウェア
 */
import * as cinerino from '@cinerino/sdk';

import { cognitoAuth } from '@motionpicture/express-middleware';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../models/error';

// 許可発行者リスト
const ISSUERS = (<string>process.env.TOKEN_ISSUERS).split(',');

export async function setAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await cognitoAuth({
            issuers: ISSUERS,
            authorizedHandler: (user, token) => {
                req.user = user;

                // リクエストに対してCinerino認証クライアントをセット
                const auth = new cinerino.auth.ClientCredentials({
                    domain: '',
                    clientId: '',
                    clientSecret: '',
                    scopes: [],
                    state: '',
                });
                // eslint-disable-next-line @typescript-eslint/naming-convention
                auth.setCredentials({ access_token: token });
                req.authClient = auth;

                next();
            },
            unauthorizedHandler: (err) => {
                next(new UnauthorizedError(err.message));
            },
        })(req, res, next);
    } catch (error) {
        next(new UnauthorizedError(error.message));
    }
}
