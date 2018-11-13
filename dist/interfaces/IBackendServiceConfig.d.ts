import { ISystemSettings } from "./ISystemSettings";
import { IWebComponentOptions } from "./IWebComponentOptions";
import { IWebPageOptions } from "./IWebPageOptions";
export interface IBackendServiceConfig {
    root: string;
    isDev: boolean;
    frontendPort: number;
    backendPort: number;
    defaultSystemSettings: ISystemSettings;
    defaultWebPageOptions: IWebPageOptions[];
    defaultWebComponentOptions: IWebComponentOptions[];
}
