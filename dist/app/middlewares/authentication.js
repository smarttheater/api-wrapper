"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthentication = void 0;
/**
 * 認証ミドルウェア
 */
const cinerino = require("@cinerino/sdk");
const express_middleware_1 = require("@motionpicture/express-middleware");
const error_1 = require("../models/error");
// 許可発行者リスト
const ISSUERS = process.env.TOKEN_ISSUERS.split(',');
function setAuthentication(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, express_middleware_1.cognitoAuth)({
                issuers: ISSUERS,
                authorizedHandler: (user, token) => __awaiter(this, void 0, void 0, function* () {
                    req.user = user;
                    // リクエストに対してCinerino認証クライアントをセット
                    const auth = new cinerino.auth.ClientCredentials({
                        domain: '',
                        clientId: '',
                        clientSecret: '',
                        scopes: [],
                        state: '',
                    });
                    auth.setCredentials({ access_token: token });
                    req.authClient = auth;
                    next();
                }),
                unauthorizedHandler: (err) => {
                    next(new error_1.UnauthorizedError(err.message));
                },
            })(req, res, next);
        }
        catch (error) {
            next(new error_1.UnauthorizedError(error.message));
        }
    });
}
exports.setAuthentication = setAuthentication;
