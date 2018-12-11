import { ApiRoute, routes } from '../common/apiRoutes';
import { inernalModuleContext } from './inernalModuleContext';

export class ApiClient {
  public getAllServices = apiCall(routes.getServices, true);
  public getServiceOptions = apiCall(routes.getServiceOptions);
  public setServiceOptions = apiCall(routes.setServiceOptions);

  public getModules = apiCall(routes.getModules, true);
  public addModule = apiCall(routes.addModule);
  public checkUpdates = apiCall(routes.checkUpdates);
  public deleteModule = apiCall(routes.deleteModule);
  public rebuildModule = apiCall(routes.rebuildModule);
  public updateModule = apiCall(routes.updateModule);

  public getWebPages = apiCall(routes.getWebPages, true);
  public setWebPage = apiCall(routes.setWebPage);
  public deleteWebPage = apiCall(routes.deleteWebPage);

  public getServerInfo = apiCall(routes.getServerInfo);
  public exitApplication = apiCall(routes.exitApplication);
  public restartApplication = apiCall(routes.restartApplication);
  public shutdownSystem = apiCall(routes.shutdownSystem);
  public rebootSystem = apiCall(routes.rebootSystem);
  public resetApplication = apiCall(routes.resetApplication);

  public getSettings = apiCall(routes.getSettings, true);
  public setSettings = apiCall(routes.setSettings);

  public getWebComponentOptions = apiCall(routes.getWebComponentOptions, true);
  public setWebComponentOptions = apiCall(routes.setWebComponentOptions);
  public deleteWebComponentOptions = apiCall(routes.deleteWebComponentOptions);

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

  const call: any = (params: TParams, data: TBody): Promise<TResponse> => {
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
    return fetch(inernalModuleContext.moduleApiPath + path, {
      method,
      body: data && JSON.stringify(data),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      }
    })
      .then(async response => {
        const text = await response.text();

        if (response.status.toString().startsWith('2')) {
          if (!text) {
            return undefined;
          }
          return JSON.parse(text);
        }

        console.log(text);
        throw Error(text);
      })
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