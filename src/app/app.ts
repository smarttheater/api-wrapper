/**
 * application設定
 */
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as fs from 'fs';
import helmet from 'helmet';
import basicAuth from './middlewares/basicAuth';
import ipFilter from './middlewares/ipFilter';
import { router } from './routes/router';
import { errorHandler } from './middlewares/errorHandler';

const file: string = fs.readFileSync('./package.json', 'utf8');
const { version } = <{ version: string }>JSON.parse(file);
process.env.VERSION = version;

/**
 * express設定
 */
const app = express();
// IP制限
app.use(ipFilter);
// ベーシック認証
app.use(basicAuth);
// セキュリティー対策
app.use(helmet());
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
app.use('/', router);

// 404
// app.use(notFoundHandler);

// error handlers
app.use(errorHandler);

export { app };
