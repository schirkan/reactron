import { IBackendServiceConfig } from '../interfaces/IBackendServiceConfig';
import { ElectronApp } from './ElectronApp';
import { ExpressApp } from './ExpressApp';
import { ModuleManager } from './ModuleManager';
import { ModuleRepository } from './ModuleRepository';
import { ServiceLoader } from './ServiceLoader';

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

            BackendService.instance = new BackendService(config);
            await BackendService.instance.start();

            console.log('BackendService is running');
        }
    }

    public readonly electronApp = new ElectronApp(this.config);
    public readonly expressApp = new ExpressApp(this.config);
    private readonly moduleRepository = new ModuleRepository();
    public readonly moduleManager = new ModuleManager(this.config, this.moduleRepository);
    public readonly serviceLoader = new ServiceLoader(this.moduleRepository);

    private constructor(public readonly config: IBackendServiceConfig) { }

    private async start(): Promise<void>{
        await this.expressApp.start();
        await this.electronApp.start();
        this.electronApp.mainWindow.loadURL('http://localhost:' + this.config.frontendPort);

        // this.moduleManager.
    }

    // TODO: stop
}