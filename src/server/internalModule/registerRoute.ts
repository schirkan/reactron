import * as express from 'express';
import { ApiRoute } from '../../common/apiRoutes';

export const registerRoute = <TParams, TBody, TResponse>(
    router: express.Router,
    route: ApiRoute<TParams, TBody, TResponse>,
    handler: (req: { params: TParams, body: TBody }, res: express.Response & { send: (body?: TResponse) => void }, next: express.NextFunction) => void | Promise<void>
): void => {
    const method = router[route.method.toLowerCase()].bind(router);
    method(route.path, handler);
};