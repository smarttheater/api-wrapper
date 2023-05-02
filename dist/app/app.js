"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
/**
 * application設定
 */
const compression = require("compression");
const cookieParser = require("cookie-parser");
const express = require("express");
const fs = require("fs");
const helmet_1 = require("helmet");
const basicAuth_1 = require("./middlewares/basicAuth");
const ipFilter_1 = require("./middlewares/ipFilter");
const router_1 = require("./routes/router");
const errorHandler_1 = require("./middlewares/errorHandler");
const file = fs.readFileSync('./package.json', 'utf8');
const { version } = JSON.parse(file);
process.env.VERSION = version;
/**
 * express設定
 */
const app = express();
exports.app = app;
// IP制限
app.use(ipFilter_1.default);
// ベーシック認証
app.use(basicAuth_1.default);
// セキュリティー対策
app.use((0, helmet_1.default)());
// cloud
const trustProxy = 1;
app.set('trust proxy', trustProxy);
// bodyParser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// cookieParser
app.use(cookieParser());
// 圧縮
app.use(compression());
// views
app.set('views', `${__dirname}/../../../views`); // view設定
app.set('view engine', 'ejs');
// ルーティング
app.use('/', router_1.router);
// 404
// app.use(notFoundHandler);
// error handlers
app.use(errorHandler_1.errorHandler);
