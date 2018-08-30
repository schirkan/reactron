import { IServiceManager } from "./IServiceManager";

export interface IExternalService {
    start(serviceLoader: IServiceManager): Promise<void>;
    stop(): Promise<void>;
    log(): void;
}