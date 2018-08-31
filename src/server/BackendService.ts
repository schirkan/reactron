import { IBackendServiceConfig } from '../interfaces/IBackendServiceConfig';
import { ElectronApp } from './ElectronApp';
import { ExpressApp } from './ExpressApp';
import { ModuleManager } from './ModuleManager';
import { ModuleRepository } from './ModuleRepository';
import { ServiceManager } from './ServiceManager';
import { ServiceRepository } from './ServiceRepository';

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

    private readonly moduleRepository = new ModuleRepository();
    private readonly serviceRepository = new ServiceRepository();
    public readonly electronApp = new ElectronApp(this.config);
    public readonly expressApp = new ExpressApp(this.config);
    public readonly serviceManager = new ServiceManager(this.serviceRepository, this.moduleRepository);
    public readonly moduleManager = new ModuleManager(this.config, this.moduleRepository, this.serviceManager);

    private constructor(public readonly config: IBackendServiceConfig) { }

    private async start(): Promise<void> {
        await this.expressApp.start();
        await this.electronApp.start();
        await this.moduleManager.loadAllModules();
        await this.serviceManager.startAllServices();
        this.electronApp.mainWindow.loadURL('http://localhost:' + this.config.frontendPort);
    }

    public async stop(): Promise<void> {
        // stop all services
        await this.serviceManager.stopAllServices();

        // quit electron
        this.electronApp.mainWindow.close();
    }

    public async restart(): Promise<void> {
        // stop all services
        await this.stop();

        // restart electron
        // 
    }
}