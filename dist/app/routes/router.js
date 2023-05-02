"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
/**
 * ルーティング
 */
const express = require("express");
const authentication_1 = require("../middlewares/authentication");
const project_1 = require("../middlewares/project");
const projectRouter_1 = require("./projectRouter");
const router = express.Router();
exports.router = router;
router.use(authentication_1.setAuthentication);
router.use(project_1.setProject);
router.use('/projects/:id', projectRouter_1.projectRouter);
