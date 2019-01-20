import { ICommandResult, IModuleRepositoryItem, IServerInfo, IServiceRepositoryItem, ISystemSettings, IWebComponentOptions, IWebPageOptions, ILogEntry } from '@schirkan/reactron-interfaces';

export class ApiRoute<TParams, TBody, TResponse = void>{
  constructor(public path: string, public method: string) { }
}

export const routes = {
  getServices: new ApiRoute<undefined, undefined, IServiceRepositoryItem[]>('/service/', 'get'),
  getServiceOptions: new ApiRoute<undefined, { moduleName: string, serviceName: string }, object>('/service/getOptions', 'post'),
  setServiceOptions: new ApiRoute<undefined, { moduleName: string, serviceName: string, options: object }>('/service/setOptions', 'post'),
  callServiceMethod: new ApiRoute<undefined, { moduleName: string, serviceName: string, methodName: string, args: any[] }, { result: any, error: string }>('/service/rpc', 'post'),

  getModules: new ApiRoute<undefined, undefined, IModuleRepositoryItem[]>('/modules/', 'get'),
  addModule: new ApiRoute<undefined, { repository: string }, ICommandResult[]>('/modules/', 'post'),
  deleteModule: new ApiRoute<undefined, { moduleName: string }, ICommandResult[]>('/modules/delete', 'delete'),
  rebuildModule: new ApiRoute<undefined, { moduleName: string }, ICommandResult[]>('/modules/rebuild', 'post'),
  updateModule: new ApiRoute<undefined, { moduleName: string }, ICommandResult[]>('/modules/update', 'post'),
  checkUpdates: new ApiRoute<undefined, undefined, ICommandResult[]>('/modules/checkUpdates', 'post'),

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

  getLogEntries: new ApiRoute<undefined, { source?: string }, ILogEntry[]>('/log/entries', 'post'),
};