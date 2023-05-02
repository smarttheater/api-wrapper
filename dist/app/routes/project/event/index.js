"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRouter = void 0;
/**
 * 取引ルーター
 */
const express = require("express");
const screeningEventRouter_1 = require("./screeningEventRouter");
const eventRouter = express.Router();
exports.eventRouter = eventRouter;
eventRouter.use('/screeningEvent', screeningEventRouter_1.screeningEventRouter);
