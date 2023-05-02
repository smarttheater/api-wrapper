/**
 * ルーティング
 */
import * as express from 'express';
import { setAuthentication } from '../middlewares/authentication';
import { setProject } from '../middlewares/project';
import { projectRouter } from './projectRouter';

const router = express.Router();

router.use(setAuthentication);
router.use(setProject);

router.use('/projects/:id', projectRouter);

export { router };
