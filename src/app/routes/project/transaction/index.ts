/**
 * 取引ルーター
 */
import * as express from 'express';
import { placeOrderRouter } from './placeOrderRouter';

const transactionRouter = express.Router();

transactionRouter.use('/placeOrder', placeOrderRouter);

export { transactionRouter };
