"use strict";
/**
 * セッション
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const connectRedis = require("connect-redis");
const createDebug = require("debug");
const session = require("express-session");
const redis = require("redis");
const debug = createDebug('application:session');
exports.redisClient = redis.createClient({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_KEY,
    tls: process.env.REDIS_TLS_SERVERNAME === undefined ||
        process.env.REDIS_TLS_SERVERNAME === ''
        ? undefined
        : {
            servername: process.env.REDIS_TLS_SERVERNAME,
        },
    return_buffers: true,
});
debug('redis host...', process.env.REDIS_HOST);
const sessionStore = new (connectRedis(session))({ client: exports.redisClient });
exports.default = session({
    secret: 'frontend-session-secret',
    resave: false,
    rolling: true,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: process.env.SESSION_COOKIE_MAX_AGE === undefined ||
            process.env.SESSION_COOKIE_MAX_AGE === ''
            ? 604800000
            : Number(process.env.SESSION_COOKIE_MAX_AGE),
    },
});
