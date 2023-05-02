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
exports.screeningEventRouter = void 0;
const cinerino = require("@cinerino/sdk");
const express = require("express");
const error_1 = require("../../../models/error");
const express_validator_1 = require("express-validator");
const validationHandler_1 = require("../../../middlewares/validationHandler");
const screeningEventRouter = express.Router();
exports.screeningEventRouter = screeningEventRouter;
/**
 * 検索
 */
screeningEventRouter.get('/search', ...[
    (0, express_validator_1.query)('limit').optional().isInt().toInt(),
    (0, express_validator_1.query)('page').optional().isInt().toInt(),
    (0, express_validator_1.query)(['startFrom', 'startThrough'])
        .not()
        .isEmpty()
        .isISO8601()
        .toDate(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { limit, page, startFrom, startThrough } = req.query;
        const eventService = new cinerino.service.Event({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            limit,
            page,
            typeOf: cinerino.factory.eventType.ScreeningEvent,
            eventStatuses: [
                cinerino.factory.eventStatusType.EventScheduled,
            ],
            startFrom,
            startThrough,
        };
        log.method = 'eventService.search';
        log.params = params;
        const result = yield eventService.search(params);
        res.json(result.data.map((data) => {
            const offers = data.offers;
            const ZERO = 0;
            const makesOffer = offers === null || offers === void 0 ? void 0 : offers.seller.makesOffer.find((o) => {
                var _a;
                return o.availableAtOrFrom !== undefined &&
                    ((_a = o.availableAtOrFrom[ZERO]) === null || _a === void 0 ? void 0 : _a.id) ===
                        process.env.CLIENT_ID_TRANSACTION;
            });
            const makesOfferLogin = offers === null || offers === void 0 ? void 0 : offers.seller.makesOffer.find((o) => {
                var _a;
                return o.availableAtOrFrom !== undefined &&
                    ((_a = o.availableAtOrFrom[ZERO]) === null || _a === void 0 ? void 0 : _a.id) ===
                        process.env.CLIENT_ID_TRANSACTION_LOGIN;
            });
            return {
                id: data.id,
                name: data.name,
                startDate: data.startDate,
                endDate: data.endDate,
                doorTime: data.doorTime,
                maximumAttendeeCapacity: data.maximumAttendeeCapacity,
                remainingAttendeeCapacity: data.remainingAttendeeCapacity,
                offers: {
                    validFrom: makesOffer === null || makesOffer === void 0 ? void 0 : makesOffer.validFrom,
                    validThrough: makesOffer === null || makesOffer === void 0 ? void 0 : makesOffer.validThrough,
                    availabilityStarts: makesOffer === null || makesOffer === void 0 ? void 0 : makesOffer.availabilityStarts,
                    availabilityEnds: makesOffer === null || makesOffer === void 0 ? void 0 : makesOffer.availabilityEnds,
                    login: {
                        validFrom: makesOfferLogin === null || makesOfferLogin === void 0 ? void 0 : makesOfferLogin.validFrom,
                        validThrough: makesOfferLogin === null || makesOfferLogin === void 0 ? void 0 : makesOfferLogin.validThrough,
                        availabilityStarts: makesOfferLogin === null || makesOfferLogin === void 0 ? void 0 : makesOfferLogin.availabilityStarts,
                        availabilityEnds: makesOfferLogin === null || makesOfferLogin === void 0 ? void 0 : makesOfferLogin.availabilityEnds,
                    },
                },
                location: {
                    name: data.location.name,
                    branchCode: data.location.branchCode,
                },
                superEvent: {
                    id: data.superEvent.id,
                    name: data.superEvent.name,
                    headline: data.superEvent.headline,
                    description: data.superEvent.description,
                    location: {
                        name: data.superEvent.location.name,
                        branchCode: data.superEvent.location.branchCode,
                    },
                    workPerformed: {
                        id: data.superEvent.workPerformed.id,
                        identifier: data.superEvent.workPerformed
                            .identifier,
                    },
                },
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
 * イベントオファー検索
 */
screeningEventRouter.get('/searchTicketOffers', ...[
    (0, express_validator_1.query)('limit').optional().isInt().toInt(),
    (0, express_validator_1.query)('page').optional().isInt().toInt(),
    (0, express_validator_1.query)('event.id').not().isEmpty(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { limit, page, event } = req.query;
        const eventService = new cinerino.service.Event({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            limit,
            page,
            event,
        };
        log.method = 'eventService.searchTicketOffers';
        log.params = params;
        const result = yield eventService.searchTicketOffers(params);
        res.json(result.map((offer) => ({
            id: offer.id,
            name: offer.name,
            description: offer.description,
            sortIndex: offer.sortIndex,
            priceSpecification: {
                priceComponent: offer.priceSpecification.priceComponent.map((p) => {
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
 * 座席ステータス検索
 */
screeningEventRouter.get('/searchSeats', ...[
    (0, express_validator_1.query)('limit').optional().isInt().toInt(),
    (0, express_validator_1.query)('page').optional().isInt().toInt(),
    (0, express_validator_1.query)('event.id').not().isEmpty(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { limit, page, event } = req.query;
        const eventService = new cinerino.service.Event({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            limit,
            page,
            event,
        };
        log.method = 'eventService.searchSeats';
        log.params = params;
        const result = yield eventService.searchSeats(params);
        res.json(result.data.map((data) => {
            var _a, _b, _c;
            return ({
                name: data.name,
                branchCode: data.branchCode,
                containedInPlace: {
                    name: (_a = data.containedInPlace) === null || _a === void 0 ? void 0 : _a.name,
                    branchCode: (_b = data.containedInPlace) === null || _b === void 0 ? void 0 : _b.branchCode,
                },
                offers: (_c = data.offers) === null || _c === void 0 ? void 0 : _c.map((o) => o.availability ===
                    cinerino.factory.itemAvailability.InStock
                    ? 'InStock'
                    : 'OutOfStock'),
            });
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
