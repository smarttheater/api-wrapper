/**
 * 取引ルーター
 */
import * as express from 'express';
import { screeningEventRouter } from './screeningEventRouter';

const eventRouter = express.Router();

eventRouter.use('/screeningEvent', screeningEventRouter);

export { eventRouter };
