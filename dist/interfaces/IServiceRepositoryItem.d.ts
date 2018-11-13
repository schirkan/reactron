import { IExternalService } from "./IExternalService";
import { IServiceDefinition } from "./IServiceDefinition";
export interface IServiceRepositoryItem extends IServiceDefinition {
    moduleName: string;
    instance: IExternalService;
    state: 'starting' | 'running' | 'stopped' | 'error';
    log: string[];
}
