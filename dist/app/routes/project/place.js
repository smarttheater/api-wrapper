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
exports.placeRouter = void 0;
const express = require("express");
const cinerino = require("@cinerino/sdk");
const error_1 = require("../../models/error");
const express_validator_1 = require("express-validator");
const validationHandler_1 = require("../../middlewares/validationHandler");
const placeRouter = express.Router();
exports.placeRouter = placeRouter;
/**
 * 施設検索
 */
placeRouter.get('/searchMovieTheaters', ...[
    (0, express_validator_1.query)('limit').optional().isInt().toInt(),
    (0, express_validator_1.query)('page').optional().isInt().toInt(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { limit, page } = req.query;
        const placeService = new cinerino.service.Place({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            limit,
            page,
        };
        log.method = 'placeService.searchMovieTheaters';
        log.params = params;
        const result = yield placeService.searchMovieTheaters(params);
        res.json(result.data.map((data) => ({
            name: data.name,
            id: data.id,
            branchCode: data.branchCode,
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
 * ルーム検索
 */
placeRouter.get('/searchScreeningRooms', ...[
    (0, express_validator_1.query)('limit').optional().isInt().toInt(),
    (0, express_validator_1.query)('page').optional().isInt().toInt(),
], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = { url: req.url, project: req.project.id };
    try {
        const { limit, page } = req.query;
        const placeService = new cinerino.service.Place({
            auth: req.authClient,
            endpoint: process.env.CINERINO_API_ENDPOINT,
            project: { id: req.project.id },
        });
        const params = {
            limit,
            page,
        };
        log.method = 'placeService.searchScreeningRooms';
        log.params = params;
        const result = yield placeService.searchScreeningRooms(params);
        res.json(result.data.map((data) => ({
            name: data.name,
            branchCode: data.branchCode,
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
