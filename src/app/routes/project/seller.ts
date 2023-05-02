import * as express from 'express';
import * as cinerino from '@cinerino/sdk';
import { APIError, ExceptionError } from '../../models/error';
import { query } from 'express-validator';
import { checkValidation } from '../../middlewares/validationHandler';

const sellerRouter = express.Router();

interface ISearch {
    limit?: number;
    page?: number;
}

type ISearchResult = Pick<
    cinerino.factory.seller.ISeller,
    'name' | 'id' | 'branchCode'
>;

/**
 * 販売者検索
 */
sellerRouter.get(
    '/search',
    ...[
        query('limit').optional().isInt().toInt(),
        query('page').optional().isInt().toInt(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { limit, page } = <ISearch>req.query;
            const sellerService = new cinerino.service.Seller({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                limit,
                page,
            };
            log.method = 'sellerService.search';
            log.params = params;
            const result = await sellerService.search(params);
            res.json(
                result.data.map(
                    (data) =>
                        <ISearchResult>{
                            name: data.name,
                            id: data.id,
                            branchCode: data.branchCode,
                        }
                )
            );
        } catch (error) {
            if (error?.code === undefined) {
                next(new ExceptionError(error?.message, log));
                return;
            }
            next(new APIError(error, log));
        }
    }
);

export { sellerRouter };
