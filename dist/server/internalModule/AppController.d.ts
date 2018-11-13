import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';
export declare class AppController implements IExternalService {
    start(helper: ServerModuleHelper): Promise<void>;
}
