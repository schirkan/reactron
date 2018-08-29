import { IExternalService } from "./IExternalService";

export interface IServiceLoader {
    getService(serviceName: string, moduleName: string): IExternalService;
    getServices(): { [key: string]: IExternalService };
}