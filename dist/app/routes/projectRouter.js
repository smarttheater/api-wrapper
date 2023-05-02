"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRouter = void 0;
/**
 * プロジェクトルーター
 */
const express = require("express");
const project_1 = require("../middlewares/project");
const transaction_1 = require("./project/transaction");
const passportsRouter_1 = require("./project/passportsRouter");
const event_1 = require("./project/event");
const seller_1 = require("./project/seller");
const place_1 = require("./project/place");
const order_1 = require("./project/order");
const payment_1 = require("./project/payment");
const product_1 = require("./project/product");
const projectRouter = express.Router();
exports.projectRouter = projectRouter;
projectRouter.use(project_1.checkProject);
projectRouter.use('/passports', passportsRouter_1.passportsRouter);
projectRouter.use('/transaction', transaction_1.transactionRouter);
projectRouter.use('/event', event_1.eventRouter);
projectRouter.use('/seller', seller_1.sellerRouter);
projectRouter.use('/place', place_1.placeRouter);
projectRouter.use('/order', order_1.orderRouter);
projectRouter.use('/payment', payment_1.paymentRouter);
projectRouter.use('/product', product_1.productRouter);
