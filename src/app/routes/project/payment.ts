import * as express from 'express';
import * as cinerino from '@cinerino/sdk';
import { APIError, ExceptionError } from '../../models/error';
import { body } from 'express-validator';
import { checkValidation } from '../../middlewares/validationHandler';

const paymentRouter = express.Router();

interface IAuthorizeCreditCard {
    purpose: {
        id: string;
    };
    object: {
        amount: number;
        creditCard: {
            token: string;
        };
        paymentMethod: string;
        issuedThrough: {
            id: string;
        };
    };
}

interface IAuthorizeCreditCardResult {
    id: string;
}

/**
 * クレジットカード決済承認
 */
paymentRouter.post(
    '/authorizeCreditCard',
    ...[
        body('purpose.id').not().isEmpty(),
        body('object.amount').not().isEmpty().isInt().toInt(),
        body('object.creditCard.token').not().isEmpty(),
        body('object.paymentMethod').not().isEmpty(),
        body('object.issuedThrough.id').not().isEmpty(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { purpose, object } = <IAuthorizeCreditCard>req.body;
            const paymentService = new cinerino.service.Payment({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                purpose: {
                    id: purpose.id,
                    typeOf: cinerino.factory.transactionType.PlaceOrder,
                },
                object: {
                    typeOf: cinerino.factory.action.authorize.paymentMethod.any
                        .ResultType.Payment,
                    amount: object.amount,
                    method: '1',
                    creditCard: object.creditCard,
                    paymentMethod: object.paymentMethod,
                    issuedThrough: {
                        id: object.issuedThrough.id,
                    },
                },
            };
            log.method = 'paymentService.authorizeCreditCard';
            log.params = params;
            const { id } = await paymentService.authorizeCreditCard(params);
            res.json(<IAuthorizeCreditCardResult>{ id });
        } catch (error) {
            if (error?.code === undefined) {
                next(new ExceptionError(error?.message, log));
                return;
            }
            next(new APIError(error, log));
        }
    }
);

interface IVoidTransaction {
    id: string;
    purpose: {
        id: string;
    };
    object: {
        typeOf: 'CreditCard';
    };
}

/**
 * 決済承認取り消し
 */
paymentRouter.post(
    '/voidTransaction',
    ...[
        body('purpose.id').not().isEmpty(),
        body('id').not().isEmpty(),
        body('object.typeOf')
            .not()
            .isEmpty()
            .custom((value: string) => {
                if (value === 'CreditCard') {
                    return true;
                }
                return false;
            }),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { id, purpose, object } = <IVoidTransaction>req.body;
            const paymentService = new cinerino.service.Payment({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                id,
                purpose: {
                    id: purpose.id,
                    typeOf: cinerino.factory.transactionType.PlaceOrder,
                },
                object: {
                    typeOf:
                        object.typeOf === 'CreditCard'
                            ? cinerino.factory.service.paymentService
                                  .PaymentServiceType.CreditCard
                            : cinerino.factory.service.paymentService
                                  .PaymentServiceType.CreditCard,
                },
            };
            log.method = 'paymentService.authorizeCreditCard';
            log.params = params;
            await paymentService.voidTransaction(params);
            res.json(<IAuthorizeCreditCardResult>{ id });
        } catch (error) {
            if (error?.code === undefined) {
                next(new ExceptionError(error?.message, log));
                return;
            }
            next(new APIError(error, log));
        }
    }
);

export { paymentRouter };
