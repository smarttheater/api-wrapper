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
exports.transactionRouter = void 0;
const cinerino = require("@cinerino/sdk");
const express = require("express");
const moment = require("moment");
const node_fetch_1 = require("node-fetch");
const error_1 = require("../models/error");
const express_validator_1 = require("express-validator");
const transactionRouter = express.Router();
exports.transactionRouter = transactionRouter;
/**
 * パスポート取得
 */
function getPassport(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { scope, project } = params;
        const waiterServerUrl = process.env.WAITER_SERVER_URL;
        if (waiterServerUrl === undefined || waiterServerUrl === '') {
            return { token: '' };
        }
        const url = `${waiterServerUrl}/projects/${project.id}/passports`;
        const body = { scope };
        const response = yield (0, node_fetch_1.default)(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            new error_1.PassportError(response);
        }
        return yield response.json();
    });
}
transactionRouter.post('/start', ...[
    (0, express_validator_1.body)('seller.id')
        .not()
        .isEmpty(),
        .withMessage(() => 'required'),
    (0, express_validator_1.body)('expires')
        .not()
        .isEmpty(),
        .withMessage(() => 'required')
        .isISO8601(),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        next(new error_1.BadRequestError(errors.array()));
    }
    const { seller, expires } = req.body;
    const placeOrderService = new cinerino.service.transaction.PlaceOrder({
        auth: req.authClient,
        endpoint: process.env.CINERINO_API_ENDPOINT,
        project: { id: req.project.id },
    });
    const passport = yield getPassport({
        scope: `Transaction:PlaceOrder:${seller.id}`,
        project: {
            id: req.project.id,
        },
    });
    const transaction = yield placeOrderService.start({
        expires: moment(expires).toDate(),
        seller: {
            typeOf: cinerino.factory.organizationType.Corporation,
            id: seller.id,
        },
        object: { passport },
    });
    res.json({
        id: transaction.id,
        expires: transaction.expires,
    });
}));
