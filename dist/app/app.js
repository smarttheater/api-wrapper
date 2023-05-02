"use strict";
const compression = require("compression");
const cookieParser = require("cookie-parser");
const express = require("express");
const fs = require("fs");
const helmet_1 = require("helmet");
const basicAuth_1 = require("./middlewares/basicAuth");
const ipFilter_1 = require("./middlewares/ipFilter");
const session_1 = require("./middlewares/session");
const router_1 = require("./routes/router");
const docRouter_1 = require("./routes/docRouter");
const errorHandler_1 = require("./functions/errorHandler");
process.env.VERSION = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
/**
 * express設定
 */
const app = express();
// IP制限
app.use(ipFilter_1.default);
// ベーシック認証
app.use(basicAuth_1.default);
// セキュリティー対策
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
}));
// cloud
app.set('trust proxy', 1);
// セッション
app.use(session_1.default);
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
// ドキュメント
app.use('/docs', docRouter_1.docRouter);
// ルーティング
app.use('/', router_1.router);
// 404
// app.use(notFoundHandler);
// error handlers
app.use(errorHandler_1.errorHandler);
module.exports = app;
