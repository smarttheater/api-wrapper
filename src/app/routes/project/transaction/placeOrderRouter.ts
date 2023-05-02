/**
 * 取引
 */
import * as cinerino from '@cinerino/sdk';
import * as express from 'express';
import * as moment from 'moment';
import { APIError, ExceptionError } from '../../../models/error';
import { body } from 'express-validator';
import { checkValidation } from '../../../middlewares/validationHandler';

const placeOrderRouter = express.Router();

interface IStart {
    /**
     * 販売者
     */
    seller: {
        id: string;
    };
    /**
     * 取引期限 ISOString
     */
    expires: Date;
    /**
     * パスポート
     */
    passport?: {
        token: string;
    };
}
interface IStartResult {
    /**
     * 取引id
     */
    id: string;
    /**
     * 取引期限 ISOString
     */
    expires: string;
}

/**
 * 取引開始
 */
placeOrderRouter.post(
    '/start',
    ...[
        body('seller.id').not().isEmpty(),
        body('expires').optional().isISO8601().toDate(),
        body('passport').optional(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { seller, expires, passport } = <IStart>req.body;
            const placeOrderService =
                new cinerino.service.transaction.PlaceOrder({
                    auth: req.authClient,
                    endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                    project: { id: req.project.id },
                });
            log.method = 'placeOrderService.start';
            log.params = {
                expires,
                seller: {
                    typeOf: cinerino.factory.organizationType.Corporation,
                    id: seller.id,
                },
                object: passport === undefined ? undefined : { passport },
            };
            const result = await placeOrderService.start({
                expires,
                seller: {
                    typeOf: cinerino.factory.organizationType.Corporation,
                    id: seller.id,
                },
                object: passport === undefined ? undefined : { passport },
            });
            res.json(<IStartResult>{
                id: result.id,
                expires: moment(result.expires).toISOString(),
            });
        } catch (error) {
            if (error?.code === undefined) {
                next(new ExceptionError(error?.message, log));
                return;
            }
            next(new APIError(error, log));
        }
    }
);

interface IConfirm {
    /**
     * 取引id
     */
    id: string;
}
interface IConfirmResult {
    /**
     * 確認番号
     */
    confirmationNumber: string;
    /**
     * 注文番号
     */
    orderNumber: string;
}

/**
 * 取引確定
 */
placeOrderRouter.post(
    '/confirm',
    ...[body('id').not().isEmpty()],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { id } = <IConfirm>req.body;
            const placeOrderService =
                new cinerino.service.transaction.PlaceOrder({
                    auth: req.authClient,
                    endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                    project: { id: req.project.id },
                });
            const params = {
                sendEmailMessage: false,
                id,
            };
            log.method = 'placeOrderService.confirm';
            log.params = params;
            const result = await placeOrderService.confirm(params);
            res.json(<IConfirmResult>{
                confirmationNumber: result.order.confirmationNumber,
                orderNumber: result.order.orderNumber,
            });
        } catch (error) {
            if (error?.code === undefined) {
                next(new ExceptionError(error?.message, log));
                return;
            }
            next(new APIError(error, log));
        }
    }
);

interface ICancel {
    /**
     * 取引id
     */
    id: string;
}

/**
 * 取引中止
 */
placeOrderRouter.post(
    '/cancel',
    ...[body('id').not().isEmpty()],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { id } = <ICancel>req.body;
            const placeOrderService =
                new cinerino.service.transaction.PlaceOrder({
                    auth: req.authClient,
                    endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                    project: { id: req.project.id },
                });
            const params = { id };
            log.method = 'placeOrderService.cancel';
            log.params = params;
            await placeOrderService.cancel(params);
            res.json();
        } catch (error) {
            if (error?.code === undefined) {
                next(new ExceptionError(error?.message, log));
                return;
            }
            next(new APIError(error, log));
        }
    }
);

interface IAuthorizeSeatReservation {
    object: {
        reservationFor: { id: string };
        acceptedOffer: {
            id: string;
            itemOffered: {
                serviceOutput: {
                    reservedTicket: {
                        ticketedSeat: {
                            seatNumber: string;
                            // seatRow: string;
                            seatSection: string;
                        };
                    };
                };
            };
            priceSpecification?: {
                appliesToMovieTicket: {
                    identifier: string;
                    serviceOutput: {
                        typeOf: string;
                    };
                }[];
            };
        }[];
    };
    purpose: {
        id: string;
    };
}

interface IAuthorizeSeatReservationResult {
    id: string;
    // result: {
    //     price: number;
    // };
}

/**
 * イベントオファー承認
 */
placeOrderRouter.post(
    '/authorizeSeatReservation',
    ...[
        body('purpose.id').not().isEmpty(),
        body('object.reservationFor.id').not().isEmpty(),
        body('purpose.acceptedOffer').not().isEmpty().isArray(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { object, purpose } = <IAuthorizeSeatReservation>req.body;
            const placeOrderService =
                new cinerino.service.transaction.PlaceOrder({
                    auth: req.authClient,
                    endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                    project: { id: req.project.id },
                });
            const params: {
                object: cinerino.factory.action.authorize.offer.seatReservation.IObjectWithoutDetail<cinerino.factory.service.webAPI.Identifier.Chevre>;
                purpose: cinerino.factory.action.authorize.offer.seatReservation.IPurpose;
                // expectsMinimalResponse?: boolean;
            } = {
                object: {
                    ...object,
                    acceptedOffer: object.acceptedOffer.map((o) => ({
                        ...o,
                        itemOffered: {
                            ...o.itemOffered,
                            serviceOutput: {
                                typeOf: cinerino.factory.reservationType
                                    .EventReservation,
                                reservedTicket: {
                                    typeOf: 'Ticket',
                                    ticketedSeat: {
                                        ...o.itemOffered.serviceOutput
                                            .reservedTicket.ticketedSeat,
                                        seatRow: '',
                                        typeOf: cinerino.factory.placeType.Seat,
                                    },
                                },
                            },
                        },
                        priceSpecification: o.priceSpecification,
                    })),
                },
                purpose: {
                    typeOf: cinerino.factory.transactionType.PlaceOrder,
                    id: purpose.id,
                },
            };
            log.method = 'placeOrderService.authorizeSeatReservation';
            log.params = params;
            const authorizeSeatReservationResult = <
                Pick<
                    cinerino.factory.action.authorize.offer.seatReservation.IAction<cinerino.factory.service.webAPI.Identifier.Chevre>,
                    'id'
                > & {
                    result: {
                        price: number;
                    };
                }
            >await placeOrderService.authorizeSeatReservation(params);
            res.json(<IAuthorizeSeatReservationResult>{
                id: authorizeSeatReservationResult.id,
                // result: {
                //     price: authorizeSeatReservationResult.result.price,
                // },
            });
        } catch (error) {
            if (error?.code === undefined) {
                next(new ExceptionError(error?.message, log));
                return;
            }
            next(new APIError(error, log));
        }
    }
);

interface IVoidSeatReservation {
    id: string;
    purpose: {
        id: string;
    };
}

/**
 * イベントオファー承認取り消し
 */
placeOrderRouter.post(
    '/voidSeatReservation',
    ...[body('id').not().isEmpty(), body('purpose.id').not().isEmpty()],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { id, purpose } = <IVoidSeatReservation>req.body;
            const placeOrderService =
                new cinerino.service.transaction.PlaceOrder({
                    auth: req.authClient,
                    endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                    project: { id: req.project.id },
                });
            const params: {
                id: string;
                purpose: cinerino.factory.action.authorize.offer.seatReservation.IPurpose;
            } = {
                id,
                purpose: {
                    typeOf: cinerino.factory.transactionType.PlaceOrder,
                    id: purpose.id,
                },
            };
            log.method = 'placeOrderService.voidSeatReservation';
            log.params = params;
            await placeOrderService.voidSeatReservation(params);
            res.json();
        } catch (error) {
            if (error?.code === undefined) {
                next(new ExceptionError(error?.message, log));
                return;
            }
            next(new APIError(error, log));
        }
    }
);

export { placeOrderRouter };
