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
exports.passportsRouter = void 0;
const express = require("express");
const node_fetch_1 = require("node-fetch");
const error_1 = require("../../models/error");
const express_validator_1 = require("express-validator");
const validationHandler_1 = require("../../middlewares/validationHandler");
const passportsRouter = express.Router();
exports.passportsRouter = passportsRouter;
/**
 * パスポート取得
 */
passportsRouter.post('', ...[(0, express_validator_1.body)('scope').not().isEmpty()], validationHandler_1.checkValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { scope } = req.body;
        const waiterServerUrl = process.env.WAITER_SERVER_URL;
        if (waiterServerUrl === undefined || waiterServerUrl === '') {
            res.json({ token: '' });
            return;
        }
        const url = `${waiterServerUrl}/projects/${req.project.id}/passports`;
        const body = { scope };
        const response = yield (0, node_fetch_1.default)(url, {
            method: 'POST',
            body: JSON.stringify(body),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            next(new error_1.PassportError(response));
            return;
        }
        const result = yield response.json();
        res.json(result);
    }
    catch (error) {
        next(new error_1.ExceptionError(error === null || error === void 0 ? void 0 : error.message));
    }
}));
