import * as cinerino from '@cinerino/sdk';
import * as express from 'express';
import { APIError, ExceptionError } from '../../../models/error';
import { query } from 'express-validator';
import { checkValidation } from '../../../middlewares/validationHandler';

const screeningEventRouter = express.Router();

interface ISearch {
    limit?: number;
    page?: number;
    startFrom: Date;
    startThrough: Date;
    // offers: {
    //     availableFrom?: Date;
    //     availableThrough?: Date;
    // };
}

interface IMinimumSuperEvent
    extends Pick<
        cinerino.factory.event.screeningEvent.IEvent,
        'id' | 'name' | 'headline' | 'description'
    > {
    location: Pick<
        cinerino.factory.place.movieTheater.IPlaceWithoutScreeningRoom,
        'name' | 'branchCode'
    >;
    workPerformed: Pick<
        cinerino.factory.creativeWork.movie.ICreativeWork,
        'id' | 'identifier'
    >;
}

interface ISearchResult
    extends Pick<
        cinerino.factory.event.screeningEvent.IEvent,
        | 'id'
        | 'startDate'
        | 'endDate'
        | 'doorTime'
        | 'maximumAttendeeCapacity'
        | 'remainingAttendeeCapacity'
    > {
    offers?: {
        validFrom?: string;
        validThrough?: string;
        availabilityStarts?: string;
        availabilityEnds?: string;
        login?: {
            validFrom?: string;
            validThrough?: string;
            availabilityStarts?: string;
            availabilityEnds?: string;
        };
    };
    location: Pick<
        Omit<cinerino.factory.place.screeningRoom.IPlace, 'containsPlace'>,
        'name' | 'branchCode'
    >;
    superEvent: IMinimumSuperEvent;
}

/**
 * 検索
 */
screeningEventRouter.get(
    '/search',
    ...[
        query('limit').optional().isInt().toInt(),
        query('page').optional().isInt().toInt(),
        query(['startFrom', 'startThrough'])
            .not()
            .isEmpty()
            .isISO8601()
            .toDate(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { limit, page, startFrom, startThrough } = <ISearch>req.query;
            const eventService = new cinerino.service.Event({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                limit,
                page,
                typeOf: cinerino.factory.eventType.ScreeningEvent,
                eventStatuses: [
                    cinerino.factory.eventStatusType.EventScheduled,
                ],
                startFrom,
                startThrough,
            };
            log.method = 'eventService.search';
            log.params = params;
            const result = await eventService.search(params);
            res.json(
                result.data.map(
                    (data: cinerino.factory.event.screeningEvent.IEvent) => {
                        const offers = <
                            | cinerino.factory.event.screeningEvent.IOffer
                            | undefined
                        >data.offers;
                        const ZERO = 0;
                        const makesOffer = offers?.seller.makesOffer.find(
                            (o) =>
                                o.availableAtOrFrom !== undefined &&
                                o.availableAtOrFrom[ZERO]?.id ===
                                    process.env.CLIENT_ID_TRANSACTION
                        );
                        const makesOfferLogin = offers?.seller.makesOffer.find(
                            (o) =>
                                o.availableAtOrFrom !== undefined &&
                                o.availableAtOrFrom[ZERO]?.id ===
                                    process.env.CLIENT_ID_TRANSACTION_LOGIN
                        );
                        return <ISearchResult>{
                            id: data.id,
                            name: data.name,
                            startDate: data.startDate,
                            endDate: data.endDate,
                            doorTime: data.doorTime,
                            maximumAttendeeCapacity:
                                data.maximumAttendeeCapacity,
                            remainingAttendeeCapacity:
                                data.remainingAttendeeCapacity,
                            offers: {
                                validFrom: makesOffer?.validFrom,
                                validThrough: makesOffer?.validThrough,
                                availabilityStarts:
                                    makesOffer?.availabilityStarts,
                                availabilityEnds: makesOffer?.availabilityEnds,
                                login: {
                                    validFrom: makesOfferLogin?.validFrom,
                                    validThrough: makesOfferLogin?.validThrough,
                                    availabilityStarts:
                                        makesOfferLogin?.availabilityStarts,
                                    availabilityEnds:
                                        makesOfferLogin?.availabilityEnds,
                                },
                            },
                            location: {
                                name: data.location.name,
                                branchCode: data.location.branchCode,
                            },
                            superEvent: {
                                id: data.superEvent.id,
                                name: data.superEvent.name,
                                headline: data.superEvent.headline,
                                description: data.superEvent.description,
                                location: {
                                    name: data.superEvent.location.name,
                                    branchCode:
                                        data.superEvent.location.branchCode,
                                },
                                workPerformed: {
                                    id: data.superEvent.workPerformed.id,
                                    identifier:
                                        data.superEvent.workPerformed
                                            .identifier,
                                },
                            },
                        };
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

interface ISearchTicketOffers {
    limit?: number;
    page?: number;
    event: {
        id: string;
    };
}

interface ISearchTicketOffersResult
    extends Pick<
        cinerino.chevre.factory.product.ITicketOffer,
        'id' | 'name' | 'description' | 'sortIndex'
    > {
    priceSpecification: {
        priceComponent: {
            name?: string | { ja: string; en: string };
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

/**
 * イベントオファー検索
 */
screeningEventRouter.get(
    '/searchTicketOffers',
    ...[
        query('limit').optional().isInt().toInt(),
        query('page').optional().isInt().toInt(),
        query('event.id').not().isEmpty(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { limit, page, event } = <ISearchTicketOffers>req.query;
            const eventService = new cinerino.service.Event({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                limit,
                page,
                event,
            };
            log.method = 'eventService.searchTicketOffers';
            log.params = params;
            const result = await eventService.searchTicketOffers(params);
            res.json(
                result.map(
                    (offer) =>
                        <ISearchTicketOffersResult>{
                            id: offer.id,
                            name: offer.name,
                            description: offer.description,
                            sortIndex: offer.sortIndex,
                            priceSpecification: {
                                priceComponent:
                                    offer.priceSpecification.priceComponent.map(
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

interface ISearchSeats {
    limit?: number;
    page?: number;
    event: {
        id: string;
    };
}

interface ISearchSeatsResult
    extends Pick<
        cinerino.factory.place.seat.IPlaceWithOffer,
        'name' | 'branchCode'
    > {
    name?: { ja: string; en: string };
    branchCode: string;
    containedInPlace: {
        name?: { ja: string; en: string };
        branchCode?: string;
    };
    offers?: ('InStock' | 'OutOfStock')[];
}

/**
 * 座席ステータス検索
 */
screeningEventRouter.get(
    '/searchSeats',
    ...[
        query('limit').optional().isInt().toInt(),
        query('page').optional().isInt().toInt(),
        query('event.id').not().isEmpty(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { limit, page, event } = <ISearchSeats>req.query;
            const eventService = new cinerino.service.Event({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                limit,
                page,
                event,
            };
            log.method = 'eventService.searchSeats';
            log.params = params;
            const result = await eventService.searchSeats(params);
            res.json(
                result.data.map(
                    (data) =>
                        <ISearchSeatsResult>{
                            name: data.name,
                            branchCode: data.branchCode,
                            containedInPlace: {
                                name: data.containedInPlace?.name,
                                branchCode: data.containedInPlace?.branchCode,
                            },
                            offers: data.offers?.map((o) =>
                                o.availability ===
                                cinerino.factory.itemAvailability.InStock
                                    ? 'InStock'
                                    : 'OutOfStock'
                            ),
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

export { screeningEventRouter };
