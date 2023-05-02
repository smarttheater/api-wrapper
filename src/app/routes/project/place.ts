import * as express from 'express';
import * as cinerino from '@cinerino/sdk';
import { APIError, ExceptionError } from '../../models/error';
import { query } from 'express-validator';
import { checkValidation } from '../../middlewares/validationHandler';

const placeRouter = express.Router();

interface ISearchMovieTheaters {
    limit?: number;
    page?: number;
}

type ISearchMovieTheatersResult = Pick<
    cinerino.factory.place.movieTheater.IPlaceWithoutScreeningRoom,
    'name' | 'branchCode' | 'id'
>;

/**
 * 施設検索
 */
placeRouter.get(
    '/searchMovieTheaters',
    ...[
        query('limit').optional().isInt().toInt(),
        query('page').optional().isInt().toInt(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { limit, page } = <ISearchMovieTheaters>req.query;
            const placeService = new cinerino.service.Place({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                limit,
                page,
            };
            log.method = 'placeService.searchMovieTheaters';
            log.params = params;
            const result = await placeService.searchMovieTheaters(params);
            res.json(
                result.data.map(
                    (data) =>
                        <ISearchMovieTheatersResult>{
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

interface ISearchScreeningRooms {
    limit?: number;
    page?: number;
}

type ISearchScreeningRoomsResult = Pick<
    cinerino.factory.place.screeningRoom.IPlace,
    'name' | 'branchCode'
>;

/**
 * ルーム検索
 */
placeRouter.get(
    '/searchScreeningRooms',
    ...[
        query('limit').optional().isInt().toInt(),
        query('page').optional().isInt().toInt(),
    ],
    checkValidation,
    async (req, res, next) => {
        const log: log.data = { url: req.url, project: req.project.id };
        try {
            const { limit, page } = <ISearchScreeningRooms>req.query;
            const placeService = new cinerino.service.Place({
                auth: req.authClient,
                endpoint: <string>process.env.CINERINO_API_ENDPOINT,
                project: { id: req.project.id },
            });
            const params = {
                limit,
                page,
            };
            log.method = 'placeService.searchScreeningRooms';
            log.params = params;
            const result = await placeService.searchScreeningRooms(params);
            res.json(
                result.data.map(
                    (data) =>
                        <ISearchScreeningRoomsResult>{
                            name: data.name,
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

export { placeRouter };
