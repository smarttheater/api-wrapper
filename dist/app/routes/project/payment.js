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
exports.paymentRouter = void 0;
const express = require("express");
const cinerino = require("@cinerino/sdk");
const error_1 = require("../../models/error");
const express_validator_1 = require("express-validator");
const validationHandler_1 = require("../../middlewares/validationHandler");
const paymentRouter = express.Router();
exports.paymentRouter = paymentRouter;
/**
 * クレジットカード決済承認
 */
paymentRouter.post('/authorizeCreditCard', ...[
    (0, express_validator_1.body)('purpose.id').not().isEmpty(),
    (0, express_validator_1.body)('object.amount').not().isEmpty().isInt().toInt(),
    (0, express_validator_1.body)('object.creditCard.token').not().isEmpty(),
    (0, express_validator_1.body)('object.paymentMethod').not().isEmpty(),
    (0, express_validator_1.body)('object.issuedThrough.id').not().isEmpty(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { purpose, object } = req.body;
        const paymentService = new cinerino.service.Payment({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            purpose: {
                id: purpose.id,
                typeOf: cinerino.factory.transactionType.PlaceOrder,
            },
            object: {
                typeOf: cinerino.factory.action.authorize.paymentMethod.any
                    .ResultType.Payment,
                amount: object.amount,
                method: '1',
                creditCard: object.creditCard,
                paymentMethod: object.paymentMethod,
                issuedThrough: {
                    id: object.issuedThrough.id,
                },
            },
        };
        log.method = 'paymentService.authorizeCreditCard';
        log.params = params;
        const { id } = yield paymentService.authorizeCreditCard(params);
        res.json({ id });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === undefined) {
            next(new error_1.ExceptionError(error === null || error === void 0 ? void 0 : error.message, log));
            return;
        }
        next(new error_1.APIError(error, log));
    }
}));
/**
 * 決済承認取り消し
 */
paymentRouter.post('/voidTransaction', ...[
    (0, express_validator_1.body)('purpose.id').not().isEmpty(),
    (0, express_validator_1.body)('id').not().isEmpty(),
    (0, express_validator_1.body)('object.typeOf')
        .not()
        .isEmpty()
        .custom((value) => {
        if (value === 'CreditCard') {
            return true;
        }
        return false;
    }),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { id, purpose, object } = req.body;
        const paymentService = new cinerino.service.Payment({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            id,
            purpose: {
                id: purpose.id,
                typeOf: cinerino.factory.transactionType.PlaceOrder,
            },
            object: {
                typeOf: object.typeOf === 'CreditCard'
                    ? cinerino.factory.service.paymentService
                        .PaymentServiceType.CreditCard
                    : cinerino.factory.service.paymentService
                        .PaymentServiceType.CreditCard,
            },
        };
        log.method = 'paymentService.authorizeCreditCard';
        log.params = params;
        yield paymentService.voidTransaction(params);
        res.json({ id });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === undefined) {
            next(new error_1.ExceptionError(error === null || error === void 0 ? void 0 : error.message, log));
            return;
        }
        next(new error_1.APIError(error, log));
    }
}));
