import { IServiceLoader } from "./IServiceLoader";

export interface IExternalService {
    start(serviceLoader: IServiceLoader): Promise<void>;
    stop(): Promise<void>;
    log(): void;
}