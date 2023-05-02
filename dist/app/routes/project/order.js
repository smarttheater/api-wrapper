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
exports.orderRouter = void 0;
const express = require("express");
const cinerino = require("@cinerino/sdk");
const error_1 = require("../../models/error");
const express_validator_1 = require("express-validator");
const validationHandler_1 = require("../../middlewares/validationHandler");
const orderRouter = express.Router();
exports.orderRouter = orderRouter;
/**
 * 注文検索
 */
orderRouter.get('/search', ...[
    (0, express_validator_1.query)('limit').optional().isInt().toInt(),
    (0, express_validator_1.query)('page').optional().isInt().toInt(),
    (0, express_validator_1.query)(['orderDate.lte', 'startThrough.gte'])
        .optional()
        .isISO8601()
        .toDate(),
    (0, express_validator_1.query)(['orderNumbers', 'confirmationNumbers'])
        .optional()
        .isArray()
        .toArray(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { limit, page, orderDate, confirmationNumbers, orderNumbers, } = req.query;
        const orderService = new cinerino.service.Order({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            limit,
            page,
            orderDate: (orderDate === null || orderDate === void 0 ? void 0 : orderDate.lte) === undefined && (orderDate === null || orderDate === void 0 ? void 0 : orderDate.gte) === undefined
                ? undefined
                : {
                    $lte: orderDate === null || orderDate === void 0 ? void 0 : orderDate.lte,
                    $gte: orderDate === null || orderDate === void 0 ? void 0 : orderDate.gte,
                },
            confirmationNumbers,
            orderNumbers,
        };
        log.method = 'orderService.search';
        log.params = params;
        const result = yield orderService.search(params);
        res.json(result.data.map((data) => ({
            orderDate: data.orderDate,
            confirmationNumber: data.confirmationNumber,
            orderNumber: data.orderNumber,
            price: data.price,
            orderStatus: data.orderStatus ===
                cinerino.factory.orderStatus.OrderReturned
                ? 'OrderReturned'
                : data.orderStatus ===
                    cinerino.factory.orderStatus
                        .OrderDelivered
                    ? 'OrderDelivered'
                    : undefined,
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
/**
 * 確認番号で注文検索
 */
orderRouter.get('/findByConfirmationNumber', ...[
    (0, express_validator_1.query)('confirmationNumber').not().isEmpty(),
    (0, express_validator_1.query)('customer.telephone').not().isEmpty(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { confirmationNumber, customer } = req.query;
        const orderService = new cinerino.service.Order({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            confirmationNumber,
            customer,
        };
        log.method = 'orderService.findByConfirmationNumber';
        log.params = params;
        const result = yield orderService.findByConfirmationNumber(params);
        res.json(result.map((data) => ({
            orderDate: data.orderDate,
            confirmationNumber: data.confirmationNumber,
            orderNumber: data.orderNumber,
            price: data.price,
            orderStatus: data.orderStatus ===
                cinerino.factory.orderStatus.OrderReturned
                ? 'OrderReturned'
                : data.orderStatus ===
                    cinerino.factory.orderStatus
                        .OrderDelivered
                    ? 'OrderDelivered'
                    : undefined,
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
/**
 * 注文アイテム検索
 */
orderRouter.get('/searchAcceptedOffersByConfirmationNumber', ...[
    (0, express_validator_1.query)('limit').optional().isInt().toInt(),
    (0, express_validator_1.query)('page').optional().isInt().toInt(),
    (0, express_validator_1.query)('confirmationNumber').not().isEmpty(),
    (0, express_validator_1.query)('orderNumber').not().isEmpty(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { page, limit, confirmationNumber, orderNumber } = req.query;
        const orderService = new cinerino.service.Order({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            page,
            limit,
            confirmationNumber,
            orderNumber,
        };
        log.method =
            'orderService.searchAcceptedOffersByConfirmationNumber';
        log.params = params;
        const result = yield orderService.searchAcceptedOffersByConfirmationNumber(params);
        res.json(result.map((data) => {
            var _a;
            let itemOffered;
            if (data.itemOffered.typeOf ===
                cinerino.chevre.factory.reservationType.EventReservation) {
                const { ticketType, ticketedSeat } = data.itemOffered.reservedTicket;
                itemOffered = {
                    id: data.itemOffered.id,
                    reservationNumber: data.itemOffered.reservationNumber,
                    reservedTicket: {
                        ticketType: {
                            id: ticketType.id,
                            identifier: ticketType.identifier,
                            name: typeof ticketType.name === 'string'
                                ? { ja: ticketType.name, en: '' }
                                : ticketType.name,
                        },
                        ticketedSeat: {
                            seatNumber: ticketedSeat === null || ticketedSeat === void 0 ? void 0 : ticketedSeat.seatNumber,
                            // seatRow: ticketedSeat?.seatRow,
                            seatSection: ticketedSeat === null || ticketedSeat === void 0 ? void 0 : ticketedSeat.seatSection,
                        },
                    },
                    priceSpecification: {
                        priceComponent: (_a = data.priceSpecification) === null || _a === void 0 ? void 0 : _a.priceComponent.map((p) => {
                            const referenceQuantity = p.typeOf ===
                                cinerino.chevre.factory
                                    .priceSpecificationType
                                    .UnitPriceSpecification
                                ? {
                                    value: p
                                        .referenceQuantity
                                        .value,
                                }
                                : undefined;
                            return {
                                name: typeof p.name === 'string'
                                    ? {
                                        ja: p.name,
                                        en: '',
                                    }
                                    : p.name,
                                price: p.price,
                                priceCurrency: p.priceCurrency,
                                typeOf: p.typeOf ===
                                    cinerino.chevre.factory
                                        .priceSpecificationType
                                        .CategoryCodeChargeSpecification
                                    ? 'CategoryCodeChargeSpecification'
                                    : p.typeOf ===
                                        cinerino.chevre
                                            .factory
                                            .priceSpecificationType
                                            .MovieTicketTypeChargeSpecification
                                        ? 'MovieTicketTypeChargeSpecification'
                                        : p.typeOf ===
                                            cinerino.chevre
                                                .factory
                                                .priceSpecificationType
                                                .UnitPriceSpecification
                                            ? 'UnitPriceSpecification'
                                            : undefined,
                                referenceQuantity,
                            };
                        }),
                    },
                };
            }
            return {
                id: data.id,
                itemOffered,
            };
        }));
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
 * 注文コード発行
 */
orderRouter.post('/authorize', ...[
    (0, express_validator_1.body)('confirmationNumber').not().isEmpty(),
    (0, express_validator_1.body)('customer.telephone').not().isEmpty(),
    (0, express_validator_1.body)('expiresInSeconds').not().isEmpty().toInt(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { customer, orderNumber, expiresInSeconds } = (req.body);
        const orderService = new cinerino.service.Order({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            object: {
                orderNumber,
                customer,
            },
            result: {
                expiresInSeconds,
            },
        };
        log.method = 'orderService.authorize';
        log.params = params;
        const { code } = yield orderService.authorize(params);
        res.json({
            code,
        });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === undefined) {
            next(new error_1.ExceptionError(error === null || error === void 0 ? void 0 : error.message, log));
            return;
        }
        next(new error_1.APIError(error, log));
    }
}));
