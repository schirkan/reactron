import { IReactronService, IReactronServiceDefinition } from "@schirkan/reactron-interfaces";

export interface IServiceRepositoryItem extends IReactronServiceDefinition {
    moduleName: string;
    instance: IReactronService;
    state: 'starting' | 'running' | 'stopped' | 'error';
    log: string[];
}