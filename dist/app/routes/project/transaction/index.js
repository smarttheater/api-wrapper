"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
/**
 * 取引ルーター
 */
const express = require("express");
const placeOrderRouter_1 = require("./placeOrderRouter");
const transactionRouter = express.Router();
exports.transactionRouter = transactionRouter;
transactionRouter.use('/placeOrder', placeOrderRouter_1.placeOrderRouter);
