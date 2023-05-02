"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidation = void 0;
const error_1 = require("../models/error");
const express_validator_1 = require("express-validator");
function checkValidation(req, _res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        next(new error_1.BadRequestError(errors.array()));
        return;
    }
    next();
}
exports.checkValidation = checkValidation;
