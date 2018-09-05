import { app } from 'electron';
import { IBackendServiceConfig } from '../interfaces/IBackendServiceConfig';
import { ISystemSettings } from '../interfaces/ISystemSettings';
import { DashboardManager } from './DashboardManager';
import { ElectronApp } from './ElectronApp';
import { ExpressApp } from './ExpressApp';
import { ModuleManager } from './ModuleManager';
import { ModuleRepository } from './ModuleRepository';
import { PubSub } from './PubSub';
import { ServiceManager } from './ServiceManager';
import { ServiceOptionsRepository } from './ServiceOptionsRepository';
import { ServiceRepository } from './ServiceRepository';
import { SystemSettingsManager } from './SystemSettingsManager';

export class BackendService {
    public static instance: BackendService;

    public readonly topics = new PubSub();
    public readonly moduleRepository = new ModuleRepository();
    public readonly serviceRepository = new ServiceRepository();
    public readonly serviceOptionsRepository = new ServiceOptionsRepository();
    public readonly electronApp = new ElectronApp(this.config);
    public readonly expressApp = new ExpressApp(this.config);
    public readonly serviceManager = new ServiceManager(this.serviceRepository, this.moduleRepository, this.serviceOptionsRepository);
    public readonly moduleManager = new ModuleManager(this.config, this.moduleRepository);
    public readonly dashboardManager = new DashboardManager(this.topics, this.config.defaultDashboardOptions);
    public readonly settings = new SystemSettingsManager<ISystemSettings>(this.topics, this.config.defaultSystemSettings);

    public constructor(public readonly config: IBackendServiceConfig) { }

    public async exit(): Promise<void> {
        this.electronApp.mainWindow.close();
        app.quit();
    }

    public async restart(): Promise<void> {
        app.relaunch();
        app.quit();
    }
}