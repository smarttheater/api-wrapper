import * as express from 'express';
import * as cinerino from '@cinerino/sdk';
import { APIError, ExceptionError } from '../../models/error';
import { query } from 'express-validator';
import { checkValidation } from '../../middlewares/validationHandler';

const productRouter = express.Router();

interface ISearchCreditCard {
    limit?: number;
    page?: number;
}

interface ISearchCreditCardResult
    extends Pick<
        Omit<
            cinerino.factory.service.paymentService.IService,
            'availableChannel' | 'provider'
        > & {
            provider?: (Pick<
                cinerino.factory.service.paymentService.IProvider,
                'id'
            > & {
                credentials?: Pick<
                    cinerino.factory.service.paymentService.IProviderCredentials,
                    'shopId' | 'tokenizationCode' // | 'paymentUrl'
                >;
            })[];
        },
        'id' | 'provider'
    > {
    serviceType?: {
        codeValue: string;
    };
}

/**
 * 決済サービス検索
 */
productRouter.get(
    '/searchCreditCard',
    ...[
        query('limit').optional().isInt().toInt(),
        query('page').optional().isInt().toInt(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { limit, page } = <ISearchCreditCard>req.query;
            const productService = new cinerino.service.Product({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                limit,
                page,
                typeOf: {
                    $eq: cinerino.factory.service.paymentService
                        .PaymentServiceType.CreditCard,
                },
            };
            log.method = 'productService.search';
            log.params = params;
            const result = await productService.search(params);
            res.json(
                result.data.map(
                    (
                        data: Omit<
                            cinerino.factory.service.paymentService.IService,
                            'availableChannel' | 'provider'
                        > & {
                            provider?: (Pick<
                                cinerino.factory.service.paymentService.IProvider,
                                'id'
                            > & {
                                credentials?: Pick<
                                    cinerino.factory.service.paymentService.IProviderCredentials,
                                    'shopId' | 'tokenizationCode'
                                    // | 'paymentUrl'
                                >;
                            })[];
                        }
                    ) =>
                        <ISearchCreditCardResult>{
                            id: data.id,
                            serviceType:
                                data.serviceType === undefined
                                    ? undefined
                                    : {
                                          codeValue: data.serviceType.codeValue,
                                      },
                            provider:
                                data.provider === undefined
                                    ? undefined
                                    : data.provider.map((p) => ({
                                          id: p.id,
                                          credentials:
                                              p.credentials === undefined
                                                  ? undefined
                                                  : {
                                                        shopId: p.credentials
                                                            .shopId,
                                                        tokenizationCode:
                                                            p.credentials
                                                                .tokenizationCode,
                                                    },
                                      })),
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

export { productRouter };
