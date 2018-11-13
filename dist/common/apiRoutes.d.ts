import { ICommandResult } from '../interfaces/ICommandResult';
import { IModuleRepositoryItem } from '../interfaces/IModuleRepositoryItem';
import { IServerInfo } from '../interfaces/IServerInfo';
import { IServiceRepositoryItem } from "../interfaces/IServiceRepositoryItem";
import { ISystemSettings } from '../interfaces/ISystemSettings';
import { IWebComponentOptions } from '../interfaces/IWebComponentOptions';
import { IWebPageOptions } from '../interfaces/IWebPageOptions';
export declare class ApiRoute<TParams, TBody, TResponse = void> {
    path: string;
    method: string;
    constructor(path: string, method: string);
}
export declare const routes: {
    getServices: ApiRoute<undefined, undefined, IServiceRepositoryItem[]>;
    getServiceOptions: ApiRoute<{
        moduleName: string;
        serviceName: string;
    }, undefined, object>;
    setServiceOptions: ApiRoute<{
        moduleName: string;
        serviceName: string;
    }, object, void>;
    getModules: ApiRoute<undefined, undefined, IModuleRepositoryItem[]>;
    addModule: ApiRoute<undefined, {
        repository: string;
    }, ICommandResult[]>;
    deleteModule: ApiRoute<{
        moduleName: string;
    }, undefined, ICommandResult[]>;
    rebuildModule: ApiRoute<{
        moduleName: string;
    }, undefined, ICommandResult[]>;
    updateModule: ApiRoute<{
        moduleName: string;
    }, undefined, ICommandResult[]>;
    checkUpdates: ApiRoute<{
        moduleName: string;
    }, undefined, ICommandResult[]>;
    getWebPages: ApiRoute<undefined, undefined, IWebPageOptions[]>;
    setWebPage: ApiRoute<undefined, IWebPageOptions, IWebPageOptions>;
    deleteWebPage: ApiRoute<{
        id: string;
    }, undefined, void>;
    getServerInfo: ApiRoute<undefined, undefined, IServerInfo>;
    exitApplication: ApiRoute<undefined, undefined, void>;
    restartApplication: ApiRoute<undefined, undefined, void>;
    shutdownSystem: ApiRoute<undefined, undefined, void>;
    rebootSystem: ApiRoute<undefined, undefined, void>;
    resetApplication: ApiRoute<undefined, undefined, void>;
    getSettings: ApiRoute<undefined, undefined, ISystemSettings>;
    setSettings: ApiRoute<undefined, ISystemSettings, void>;
    getWebComponentOptions: ApiRoute<undefined, undefined, IWebComponentOptions[]>;
    setWebComponentOptions: ApiRoute<undefined, IWebComponentOptions, IWebComponentOptions>;
    deleteWebComponentOptions: ApiRoute<{
        id: string;
    }, undefined, void>;
};
