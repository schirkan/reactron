import { IExternalService } from "./IExternalService";

export interface IServiceManager {
    get(serviceName: string, moduleName: string): IExternalService | undefined;
    getAll(): { [key: string]: IExternalService };
}