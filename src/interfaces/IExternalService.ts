import { ServiceManager } from "../server/ServiceManager";

export interface IExternalService {
    start(serviceLoader: ServiceManager): Promise<void>;
    stop(): Promise<void>;
    setOptions(options: any): Promise<void>;
}