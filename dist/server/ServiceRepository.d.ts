import { IServiceRepositoryItem } from '../interfaces/IServiceRepositoryItem';
export declare class ServiceRepository {
    private readonly services;
    constructor();
    add(service: IServiceRepositoryItem): void;
    remove(moduleName: string, serviceName: string): void;
    get(moduleName: string, serviceName: string): IServiceRepositoryItem | undefined;
    getAll(): IServiceRepositoryItem[];
}
