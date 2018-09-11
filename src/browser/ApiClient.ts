import { ApiRoute, routes } from '../common/apiRoutes';
import { BrowserModuleHelper } from './BrowserModuleHelper';

const inernalModuleHelper = new BrowserModuleHelper('internal');

export class ApiClient {
    public getModules = apiCall(routes.getModules, true);
    public getWebPages = apiCall(routes.getWebPages, true);
    public setWebPage = apiCall(routes.setWebPage);
    public deleteWebPage = apiCall(routes.deleteWebPage);
    public getWebComponentOptions = apiCall(routes.getWebComponentOptions, true);
    public setWebComponentOptions = apiCall(routes.setWebComponentOptions);
    public deleteWebComponentOptions = apiCall(routes.deleteWebComponentOptions);
    public getAllServices = apiCall(routes.getServices, true);
    public getServiceOptions = apiCall(routes.getServiceOptions);
    public setServiceOptions = apiCall(routes.setServiceOptions);

    public clearCache() {
        Object.keys(this).forEach(key => {
            if (this[key] && this[key].clearCache) {
                this[key].clearCache();
            }
        });
    }
}

interface IApiCall<TParams, TBody, TResponse> {
    (params?: TParams, body?: TBody): Promise<TResponse>;
    clearCache: () => void;
}

const apiCall = <TParams, TBody, TResponse>(
    route: ApiRoute<TParams, TBody, TResponse>,
    cacheResponse: boolean = false) => {
    let cache: any;
    const method = route.method.toLocaleLowerCase();

    const call: any = (params: TParams, body: TBody): Promise<TResponse> => {
        if (cacheResponse && cache) {
            return Promise.resolve(cache);
        }

        let path = route.path;
        // replace params in path
        if (params) {
            Object.keys(params).forEach(key => {
                path = path.replace(':' + key, params[key]);
            });
        }
        return fetch(inernalModuleHelper.moduleApiPath + path, {
            method,
            body: body && JSON.stringify(body)
        })
            .then(response => response.json())
            .then(response => {
                if (cacheResponse) {
                    cache = response;
                }
                return response;
            });
    };

    call.clearCache = () => {
        cache = undefined;
    };

    return call as IApiCall<TParams, TBody, TResponse>;
};

export const apiClient = new ApiClient();