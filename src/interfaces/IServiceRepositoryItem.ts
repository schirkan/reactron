import { IExternalService } from "./IExternalService";

export interface IServiceRepositoryItem {
    moduleName: string;
    name: string;
    instance: IExternalService;
    description: string;
    state: 'starting' | 'running' | 'stopped' | 'error';
    log: string[];
}