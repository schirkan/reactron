import { IExternalService } from '../../interfaces/IExternalService';
import { ServerModuleHelper } from '../ServerModuleHelper';
export declare class SettingsController implements IExternalService {
    start(helper: ServerModuleHelper): Promise<void>;
}
