import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';
export declare class ModuleController implements IExternalService {
    start(helper: ServerModuleHelper): Promise<void>;
}
