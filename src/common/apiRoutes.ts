import { ICommandResult } from '../interfaces/ICommandResult';
import { IModuleRepositoryItem } from '../interfaces/IModuleRepositoryItem';
import { IServerInfo } from '../interfaces/IServerInfo';
import { IServiceRepositoryItem } from "../interfaces/IServiceRepositoryItem";
import { ISystemSettings } from '../interfaces/ISystemSettings';
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
    addModule: new ApiRoute<{ repository: string }, undefined, ICommandResult<void>>('/modules/:repository', 'post'),
    getModule: new ApiRoute<{ moduleName: string }, undefined, IModuleRepositoryItem>('/modules/:moduleName', 'get'),
    deleteModule: new ApiRoute<{ moduleName: string }, undefined, ICommandResult<void>>('/modules/:moduleName', 'delete'),
    buildModule: new ApiRoute<{ moduleName: string }, undefined, ICommandResult<void>>('/modules/:moduleName/build', 'post'),
    installModule: new ApiRoute<{ moduleName: string }, undefined, ICommandResult<void>>('/modules/:moduleName/install', 'post'),
    updateModule: new ApiRoute<{ moduleName: string }, undefined, ICommandResult<void>>('/modules/:moduleName/update', 'post'),

    getWebPages: new ApiRoute<undefined, undefined, IWebPageOptions[]>('/pages/', 'get'),
    setWebPage: new ApiRoute<undefined, IWebPageOptions>('/pages/', 'post'),
    deleteWebPage: new ApiRoute<{ path: string }, undefined>('/pages/:path', 'delete'),

    getServerInfo: new ApiRoute<undefined, undefined, IServerInfo>('/app/', 'get'),
    restartApp: new ApiRoute<undefined, undefined>('/app/restart', 'post'),
    exitApp: new ApiRoute<undefined, undefined>('/app/exit', 'post'),
    
    getSettings: new ApiRoute<undefined, undefined, ISystemSettings>('/settings/', 'get'),
    setSettings: new ApiRoute<undefined, ISystemSettings>('/settings/', 'post'),

    getWebComponentOptions: new ApiRoute<undefined, undefined, IWebComponentOptions[]>('/components/', 'get'),
    setWebComponentOptions: new ApiRoute<undefined, IWebComponentOptions>('/components/', 'post'),
    deleteWebComponentOptions: new ApiRoute<{ id: string }, undefined>('/components/:id', 'delete'),
};