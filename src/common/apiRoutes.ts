import { IModuleRepositoryItem } from '../interfaces/IModuleRepositoryItem';
import { IServiceRepositoryItem } from "../interfaces/IServiceRepositoryItem";
import { IWebComponentOptions } from '../interfaces/IWebComponentOptions';
import { IWebPageOptions } from '../interfaces/IWebPageOptions';

export class ApiRoute<TParams, TBody, TResponse = void>{
    constructor(
        public path: string,
        public method: string
    ) { }
}

export const routes = {
    getServices: new ApiRoute<undefined, undefined, IServiceRepositoryItem[]>('/service/', 'get'),
    getServiceOptions: new ApiRoute<{ moduleName: string, serviceName: string }, undefined, object>('/service/:moduleName/:serviceName', 'get'),
    setServiceOptions: new ApiRoute<{ moduleName: string, serviceName: string }, object>('/service/:moduleName/:serviceName', 'post'),
    getModules: new ApiRoute<undefined, undefined, IModuleRepositoryItem[]>('/modules/', 'get'),
    getWebPages: new ApiRoute<undefined, undefined, IWebPageOptions[]>('/pages/', 'get'),
    setWebPage: new ApiRoute<undefined, IWebPageOptions>('/pages/', 'post'),
    deleteWebPage: new ApiRoute<{path: string}, undefined>('/pages/:path', 'delete'),
    getWebComponentOptions: new ApiRoute<undefined, undefined, IWebComponentOptions[]>('/components/', 'get'),
    setWebComponentOptions: new ApiRoute<undefined, IWebComponentOptions>('/components/', 'post'),
    deleteWebComponentOptions: new ApiRoute<{id: string}, undefined>('/components/:id', 'delete'),
};