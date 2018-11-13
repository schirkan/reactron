import { ServerModuleHelper } from "../server/ServerModuleHelper";
export interface IExternalService {
    start(helper: ServerModuleHelper): Promise<void>;
    stop?(): Promise<void>;
    setOptions?(options: any): Promise<void>;
}
