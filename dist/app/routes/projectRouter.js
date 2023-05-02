"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRouter = void 0;
/**
 * プロジェクトルーター
 */
const express = require("express");
const project_1 = require("../middlewares/project");
const transactionRouter_1 = require("./transactionRouter");
const projectRouter = express.Router();
exports.projectRouter = projectRouter;
projectRouter.use(project_1.checkProject);
projectRouter.use('/transaction', transactionRouter_1.transactionRouter);
