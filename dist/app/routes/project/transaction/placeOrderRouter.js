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
exports.placeOrderRouter = void 0;
/**
 * 取引
 */
const cinerino = require("@cinerino/sdk");
const express = require("express");
const moment = require("moment");
const error_1 = require("../../../models/error");
const express_validator_1 = require("express-validator");
const validationHandler_1 = require("../../../middlewares/validationHandler");
const placeOrderRouter = express.Router();
exports.placeOrderRouter = placeOrderRouter;
/**
 * 取引開始
 */
placeOrderRouter.post('/start', ...[
    (0, express_validator_1.body)('seller.id').not().isEmpty(),
    (0, express_validator_1.body)('expires').optional().isISO8601().toDate(),
    (0, express_validator_1.body)('passport').optional(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { seller, expires, passport } = req.body;
        const placeOrderService = new cinerino.service.transaction.PlaceOrder({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        log.method = 'placeOrderService.start';
        log.params = {
            expires,
            seller: {
                typeOf: cinerino.factory.organizationType.Corporation,
                id: seller.id,
            },
            object: passport === undefined ? undefined : { passport },
        };
        const result = yield placeOrderService.start({
            expires,
            seller: {
                typeOf: cinerino.factory.organizationType.Corporation,
                id: seller.id,
            },
            object: passport === undefined ? undefined : { passport },
        });
        res.json({
            id: result.id,
            expires: moment(result.expires).toISOString(),
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
/**
 * 取引確定
 */
placeOrderRouter.post('/confirm', ...[(0, express_validator_1.body)('id').not().isEmpty()], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { id } = req.body;
        const placeOrderService = new cinerino.service.transaction.PlaceOrder({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            sendEmailMessage: false,
            id,
        };
        log.method = 'placeOrderService.confirm';
        log.params = params;
        const result = yield placeOrderService.confirm(params);
        res.json({
            confirmationNumber: result.order.confirmationNumber,
            orderNumber: result.order.orderNumber,
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
/**
 * 取引中止
 */
placeOrderRouter.post('/cancel', ...[(0, express_validator_1.body)('id').not().isEmpty()], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { id } = req.body;
        const placeOrderService = new cinerino.service.transaction.PlaceOrder({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = { id };
        log.method = 'placeOrderService.cancel';
        log.params = params;
        yield placeOrderService.cancel(params);
        res.json();
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
 * イベントオファー承認
 */
placeOrderRouter.post('/authorizeSeatReservation', ...[
    (0, express_validator_1.body)('purpose.id').not().isEmpty(),
    (0, express_validator_1.body)('object.reservationFor.id').not().isEmpty(),
    (0, express_validator_1.body)('purpose.acceptedOffer').not().isEmpty().isArray(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { object, purpose } = req.body;
        const placeOrderService = new cinerino.service.transaction.PlaceOrder({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            object: Object.assign(Object.assign({}, object), { acceptedOffer: object.acceptedOffer.map((o) => (Object.assign(Object.assign({}, o), { itemOffered: Object.assign(Object.assign({}, o.itemOffered), { serviceOutput: {
                            typeOf: cinerino.factory.reservationType
                                .EventReservation,
                            reservedTicket: {
                                typeOf: 'Ticket',
                                ticketedSeat: Object.assign(Object.assign({}, o.itemOffered.serviceOutput
                                    .reservedTicket.ticketedSeat), { seatRow: '', typeOf: cinerino.factory.placeType.Seat }),
                            },
                        } }), priceSpecification: o.priceSpecification }))) }),
            purpose: {
                typeOf: cinerino.factory.transactionType.PlaceOrder,
                id: purpose.id,
            },
        };
        log.method = 'placeOrderService.authorizeSeatReservation';
        log.params = params;
        const authorizeSeatReservationResult = yield placeOrderService.authorizeSeatReservation(params);
        res.json({
            id: authorizeSeatReservationResult.id,
            // result: {
            //     price: authorizeSeatReservationResult.result.price,
            // },
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
/**
 * イベントオファー承認取り消し
 */
placeOrderRouter.post('/voidSeatReservation', ...[(0, express_validator_1.body)('id').not().isEmpty(), (0, express_validator_1.body)('purpose.id').not().isEmpty()], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { id, purpose } = req.body;
        const placeOrderService = new cinerino.service.transaction.PlaceOrder({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            id,
            purpose: {
                typeOf: cinerino.factory.transactionType.PlaceOrder,
                id: purpose.id,
            },
        };
        log.method = 'placeOrderService.voidSeatReservation';
        log.params = params;
        yield placeOrderService.voidSeatReservation(params);
        res.json();
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === undefined) {
            next(new error_1.ExceptionError(error === null || error === void 0 ? void 0 : error.message, log));
            return;
        }
        next(new error_1.APIError(error, log));
    }
}));
