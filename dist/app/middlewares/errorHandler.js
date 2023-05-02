"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_1 = require("http-status");
function errorHandler(err, _req, res) {
    const status = err.status === undefined ? http_status_1.INTERNAL_SERVER_ERROR : err.status;
    res.status(status).json({
        message: err.message,
    });
}
exports.errorHandler = errorHandler;
