/**
 * プロジェクトルーター
 */
import * as express from 'express';
import { checkProject } from '../middlewares/project';
import { transactionRouter } from './project/transaction';
import { passportsRouter } from './project/passportsRouter';
import { eventRouter } from './project/event';
import { sellerRouter } from './project/seller';
import { placeRouter } from './project/place';
import { orderRouter } from './project/order';
import { paymentRouter } from './project/payment';
import { productRouter } from './project/product';

const projectRouter = express.Router();

projectRouter.use(checkProject);
projectRouter.use('/passports', passportsRouter);
projectRouter.use('/transaction', transactionRouter);
projectRouter.use('/event', eventRouter);
projectRouter.use('/seller', sellerRouter);
projectRouter.use('/place', placeRouter);
projectRouter.use('/order', orderRouter);
projectRouter.use('/payment', paymentRouter);
projectRouter.use('/product', productRouter);

export { projectRouter };
