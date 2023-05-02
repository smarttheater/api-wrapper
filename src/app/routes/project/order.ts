import * as express from 'express';
import * as cinerino from '@cinerino/sdk';
import { APIError, ExceptionError } from '../../models/error';
import { body, query } from 'express-validator';
import { checkValidation } from '../../middlewares/validationHandler';

const orderRouter = express.Router();

interface ISearch {
    limit?: number;
    page?: number;
    orderDate?: {
        lte?: Date;
        gte?: Date;
    };
    orderNumbers: string[];
    confirmationNumbers: string[];
}

interface ISearchResult
    extends Pick<
        Omit<
            cinerino.chevre.factory.order.IOrder,
            | 'url'
            | 'acceptedOffers'
            | 'discounts'
            | 'identifier'
            | 'isGift'
            | 'returner'
        >,
        'orderDate' | 'confirmationNumber' | 'orderNumber' | 'price'
    > {
    orderStatus?: 'OrderReturned' | 'OrderDelivered';
}

/**
 * 注文検索
 */
orderRouter.get(
    '/search',
    ...[
        query('limit').optional().isInt().toInt(),
        query('page').optional().isInt().toInt(),
        query(['orderDate.lte', 'startThrough.gte'])
            .optional()
            .isISO8601()
            .toDate(),
        query(['orderNumbers', 'confirmationNumbers'])
            .optional()
            .isArray()
            .toArray(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const {
                limit,
                page,
                orderDate,
                confirmationNumbers,
                orderNumbers,
            } = <ISearch>req.query;
            const orderService = new cinerino.service.Order({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                limit,
                page,
                orderDate:
                    orderDate?.lte === undefined && orderDate?.gte === undefined
                        ? undefined
                        : {
                              $lte: orderDate?.lte,
                              $gte: orderDate?.gte,
                          },
                confirmationNumbers,
                orderNumbers,
            };
            log.method = 'orderService.search';
            log.params = params;
            const result = await orderService.search(params);
            res.json(
                result.data.map(
                    (data) =>
                        <ISearchResult>{
                            orderDate: data.orderDate,
                            confirmationNumber: data.confirmationNumber,
                            orderNumber: data.orderNumber,
                            price: data.price,
                            orderStatus:
                                data.orderStatus ===
                                cinerino.factory.orderStatus.OrderReturned
                                    ? 'OrderReturned'
                                    : data.orderStatus ===
                                      cinerino.factory.orderStatus
                                          .OrderDelivered
                                    ? 'OrderDelivered'
                                    : undefined,
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

interface IFindByConfirmationNumber {
    confirmationNumber: string;
    customer: {
        telephone: string;
    };
}

interface IFindByConfirmationNumberResult
    extends Pick<
        Omit<
            cinerino.factory.order.IOrder,
            'acceptedOffers' | 'discounts' | 'identifier' | 'isGift' | 'url'
        >,
        'orderDate' | 'confirmationNumber' | 'orderNumber' | 'price'
    > {
    orderStatus?: 'OrderReturned' | 'OrderDelivered';
}

/**
 * 確認番号で注文検索
 */
orderRouter.get(
    '/findByConfirmationNumber',
    ...[
        query('confirmationNumber').not().isEmpty(),
        query('customer.telephone').not().isEmpty(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { confirmationNumber, customer } = <
                IFindByConfirmationNumber
            >req.query;
            const orderService = new cinerino.service.Order({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                confirmationNumber,
                customer,
            };
            log.method = 'orderService.findByConfirmationNumber';
            log.params = params;
            const result = await orderService.findByConfirmationNumber(params);
            res.json(
                result.map(
                    (data) =>
                        <IFindByConfirmationNumberResult>{
                            orderDate: data.orderDate,
                            confirmationNumber: data.confirmationNumber,
                            orderNumber: data.orderNumber,
                            price: data.price,
                            orderStatus:
                                data.orderStatus ===
                                cinerino.factory.orderStatus.OrderReturned
                                    ? 'OrderReturned'
                                    : data.orderStatus ===
                                      cinerino.factory.orderStatus
                                          .OrderDelivered
                                    ? 'OrderDelivered'
                                    : undefined,
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

interface IsearchAcceptedOffersByConfirmationNumber {
    limit?: number;
    page?: number;
    orderNumber: string;
    confirmationNumber: string;
}

interface IMinimumItemOffered
    extends Pick<
        cinerino.chevre.factory.order.IEventReservation,
        'id' | 'reservationNumber'
    > {
    reservedTicket: {
        ticketType: {
            identifier: string;
            name?: { ja: string; en: string };
        };
        ticketedSeat?: {
            seatNumber: string;
            // seatRow: string;
            seatSection: string;
        };
    };
    priceSpecification: {
        priceComponent: {
            id?: string;
            name?: { ja: string; en: string };
            price: number;
            priceCurrency: cinerino.chevre.factory.priceCurrency;
            typeOf?:
                | 'CategoryCodeChargeSpecification'
                | 'MovieTicketTypeChargeSpecification'
                | 'UnitPriceSpecification';
            referenceQuantity?: {
                value: number;
            };
        }[];
    };
}

interface IsearchAcceptedOffersByConfirmationNumberResult {
    itemOffered?: IMinimumItemOffered;
}

/**
 * 注文アイテム検索
 */
orderRouter.get(
    '/searchAcceptedOffersByConfirmationNumber',
    ...[
        query('limit').optional().isInt().toInt(),
        query('page').optional().isInt().toInt(),
        query('confirmationNumber').not().isEmpty(),
        query('orderNumber').not().isEmpty(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { page, limit, confirmationNumber, orderNumber } = <
                IsearchAcceptedOffersByConfirmationNumber
            >req.query;
            const orderService = new cinerino.service.Order({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                page,
                limit,
                confirmationNumber,
                orderNumber,
            };
            log.method =
                'orderService.searchAcceptedOffersByConfirmationNumber';
            log.params = params;
            const result =
                await orderService.searchAcceptedOffersByConfirmationNumber(
                    params
                );
            res.json(
                result.map((data) => {
                    let itemOffered;
                    if (
                        data.itemOffered.typeOf ===
                        cinerino.chevre.factory.reservationType.EventReservation
                    ) {
                        const { ticketType, ticketedSeat } =
                            data.itemOffered.reservedTicket;
                        itemOffered = {
                            id: data.itemOffered.id,
                            reservationNumber:
                                data.itemOffered.reservationNumber,
                            reservedTicket: {
                                ticketType: {
                                    id: ticketType.id,
                                    identifier: ticketType.identifier,
                                    name:
                                        typeof ticketType.name === 'string'
                                            ? { ja: ticketType.name, en: '' }
                                            : ticketType.name,
                                },
                                ticketedSeat: {
                                    seatNumber: ticketedSeat?.seatNumber,
                                    // seatRow: ticketedSeat?.seatRow,
                                    seatSection: ticketedSeat?.seatSection,
                                },
                            },
                            priceSpecification: {
                                priceComponent:
                                    data.priceSpecification?.priceComponent.map(
                                        (p) => {
                                            const referenceQuantity =
                                                p.typeOf ===
                                                cinerino.chevre.factory
                                                    .priceSpecificationType
                                                    .UnitPriceSpecification
                                                    ? {
                                                          value: p
                                                              .referenceQuantity
                                                              .value,
                                                      }
                                                    : undefined;

                                            return {
                                                name:
                                                    typeof p.name === 'string'
                                                        ? {
                                                              ja: p.name,
                                                              en: '',
                                                          }
                                                        : p.name,
                                                price: p.price,
                                                priceCurrency: p.priceCurrency,
                                                typeOf:
                                                    p.typeOf ===
                                                    cinerino.chevre.factory
                                                        .priceSpecificationType
                                                        .CategoryCodeChargeSpecification
                                                        ? 'CategoryCodeChargeSpecification'
                                                        : p.typeOf ===
                                                          cinerino.chevre
                                                              .factory
                                                              .priceSpecificationType
                                                              .MovieTicketTypeChargeSpecification
                                                        ? 'MovieTicketTypeChargeSpecification'
                                                        : p.typeOf ===
                                                          cinerino.chevre
                                                              .factory
                                                              .priceSpecificationType
                                                              .UnitPriceSpecification
                                                        ? 'UnitPriceSpecification'
                                                        : undefined,
                                                referenceQuantity,
                                            };
                                        }
                                    ),
                            },
                        };
                    }
                    return <IsearchAcceptedOffersByConfirmationNumberResult>{
                        id: data.id,
                        itemOffered,
                    };
                })
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

interface IAuthorize {
    orderNumber: string;
    customer: {
        telephone: string;
    };
    expiresInSeconds: number;
}

interface IAuthorizeResult {
    code: string;
}

/**
 * 注文コード発行
 */
orderRouter.post(
    '/authorize',
    ...[
        body('confirmationNumber').not().isEmpty(),
        body('customer.telephone').not().isEmpty(),
        body('expiresInSeconds').not().isEmpty().toInt(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { customer, orderNumber, expiresInSeconds } = <IAuthorize>(
                req.body
            );
            const orderService = new cinerino.service.Order({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                object: {
                    orderNumber,
                    customer,
                },
                result: {
                    expiresInSeconds,
                },
            };
            log.method = 'orderService.authorize';
            log.params = params;
            const { code } = await orderService.authorize(params);
            res.json(<IAuthorizeResult>{
                code,
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

export { orderRouter };
