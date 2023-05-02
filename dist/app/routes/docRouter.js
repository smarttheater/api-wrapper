"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docRouter = void 0;
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const docRouter = express.Router();
exports.docRouter = docRouter;
// Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hello World',
            version: '1.0.0',
        },
    },
    apis: ['./dist/app/routes/transactionRouter.js'],
};
docRouter.use('/api/transaction', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));
