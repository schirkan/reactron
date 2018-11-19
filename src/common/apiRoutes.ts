import { ICommandResult, IModuleRepositoryItem, IServerInfo, IServiceRepositoryItem, ISystemSettings, IWebComponentOptions, IWebPageOptions } from '@schirkan/reactron-interfaces';

export class ApiRoute<TParams, TBody, TResponse = void>{
    constructor(public path: string, public method: string) { }
}

export const routes = {
    getServices: new ApiRoute<undefined, undefined, IServiceRepositoryItem[]>('/service/', 'get'),
    getServiceOptions: new ApiRoute<{ moduleName: string, serviceName: string }, undefined, object>('/service/:moduleName/:serviceName', 'get'),
    setServiceOptions: new ApiRoute<{ moduleName: string, serviceName: string }, object>('/service/:moduleName/:serviceName', 'post'),

    getModules: new ApiRoute<undefined, undefined, IModuleRepositoryItem[]>('/modules/', 'get'),
    addModule: new ApiRoute<undefined, { repository: string }, ICommandResult[]>('/modules/', 'post'),
    deleteModule: new ApiRoute<{ moduleName: string }, undefined, ICommandResult[]>('/modules/:moduleName', 'delete'),
    rebuildModule: new ApiRoute<{ moduleName: string }, undefined, ICommandResult[]>('/modules/:moduleName/rebuild', 'post'),
    updateModule: new ApiRoute<{ moduleName: string }, undefined, ICommandResult[]>('/modules/:moduleName/update', 'post'),
    checkUpdates: new ApiRoute<{ moduleName: string }, undefined, ICommandResult[]>('/modules/checkUpdates/update', 'get'),

    getWebPages: new ApiRoute<undefined, undefined, IWebPageOptions[]>('/pages/', 'get'),
    setWebPage: new ApiRoute<undefined, IWebPageOptions, IWebPageOptions>('/pages/', 'post'),
    deleteWebPage: new ApiRoute<{ id: string }, undefined>('/pages/:id', 'delete'),

    getServerInfo: new ApiRoute<undefined, undefined, IServerInfo>('/app/', 'get'),
    exitApplication: new ApiRoute<undefined, undefined>('/app/exitApplication', 'post'),
    restartApplication: new ApiRoute<undefined, undefined>('/app/restartApplication', 'post'),
    shutdownSystem: new ApiRoute<undefined, undefined>('/app/shutdownSystem', 'post'),
    rebootSystem: new ApiRoute<undefined, undefined>('/app/restartSystem', 'post'),
    resetApplication: new ApiRoute<undefined, undefined>('/app/resetApplication', 'post'),

    getSettings: new ApiRoute<undefined, undefined, ISystemSettings>('/settings/', 'get'),
    setSettings: new ApiRoute<undefined, ISystemSettings>('/settings/', 'post'),

    getWebComponentOptions: new ApiRoute<undefined, undefined, IWebComponentOptions[]>('/components/', 'get'),
    setWebComponentOptions: new ApiRoute<undefined, IWebComponentOptions, IWebComponentOptions>('/components/', 'post'),
    deleteWebComponentOptions: new ApiRoute<{ id: string }, undefined>('/components/:id', 'delete'),
};