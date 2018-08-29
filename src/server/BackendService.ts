import { ElectronApp } from './ElectronApp';
import { ExpressApp } from './ExpressApp';
import { IBackendServiceConfig } from './IBackendServiceConfig';
import { ModuleInstaller } from './ModuleInstaller';

export class BackendService {
    public static instance: BackendService;
    public static async start(root: string): Promise<void> {
        if (!BackendService.instance) {
            const isDev = process.env.NODE_ENV !== 'production';
            const config = {
                root,
                isDev,
                frontendPort: 3000,
                backendPort: isDev ? 5000 : 3000
            };

            console.log('BackendService is starting', config);

            const instance = BackendService.instance = new BackendService(config);
            await instance.expressApp.start();
            await instance.electronApp.start();
            instance.electronApp.mainWindow.loadURL('http://localhost:' + instance.config.frontendPort);

            console.log('BackendService is running');
        }
    }

    public readonly electronApp = new ElectronApp(this.config);
    public readonly expressApp = new ExpressApp(this.config);
    public readonly moduleInstaller = new ModuleInstaller(this.config);

    constructor(public readonly config: IBackendServiceConfig) { }
}