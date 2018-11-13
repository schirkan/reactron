import { IBackendServiceConfig } from "../interfaces/IBackendServiceConfig";
export declare class ElectronApp {
    private config;
    mainWindow: Electron.BrowserWindow;
    constructor(config: IBackendServiceConfig);
    start(): Promise<void>;
}
