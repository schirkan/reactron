import { IDashboardOptions } from "./IDashboardOptions";
import { ISystemSettings } from "./ISystemSettings";

export interface IBackendServiceConfig {
    root: string;
    isDev: boolean;
    frontendPort: number;
    backendPort: number;
    defaultSystemSettings: ISystemSettings;
    defaultDashboardOptions: IDashboardOptions;
}