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
exports.productRouter = void 0;
const express = require("express");
const cinerino = require("@cinerino/sdk");
const error_1 = require("../../models/error");
const express_validator_1 = require("express-validator");
const validationHandler_1 = require("../../middlewares/validationHandler");
const productRouter = express.Router();
exports.productRouter = productRouter;
/**
 * 決済サービス検索
 */
productRouter.get('/searchCreditCard', ...[
    (0, express_validator_1.query)('limit').optional().isInt().toInt(),
    (0, express_validator_1.query)('page').optional().isInt().toInt(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { limit, page } = req.query;
        const productService = new cinerino.service.Product({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            limit,
            page,
            typeOf: {
                $eq: cinerino.factory.service.paymentService
                    .PaymentServiceType.CreditCard,
            },
        };
        log.method = 'productService.search';
        log.params = params;
        const result = yield productService.search(params);
        res.json(result.data.map((data) => ({
            id: data.id,
            serviceType: data.serviceType === undefined
                ? undefined
                : {
                    codeValue: data.serviceType.codeValue,
                },
            provider: data.provider === undefined
                ? undefined
                : data.provider.map((p) => ({
                    id: p.id,
                    credentials: p.credentials === undefined
                        ? undefined
                        : {
                            shopId: p.credentials
                                .shopId,
                            tokenizationCode: p.credentials
                                .tokenizationCode,
                        },
                })),
        })));
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === undefined) {
            next(new error_1.ExceptionError(error === null || error === void 0 ? void 0 : error.message, log));
            return;
        }
        next(new error_1.APIError(error, log));
    }
}));
