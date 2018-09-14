import { app } from 'electron';
import * as path from 'path';
import { IBackendServiceConfig } from '../interfaces/IBackendServiceConfig';
import { ISystemSettings } from '../interfaces/ISystemSettings';
import { ElectronApp } from './ElectronApp';
import { ExpressApp } from './ExpressApp';
import { ModuleManager } from './ModuleManager';
import { ModuleRepository } from './ModuleRepository';
import { PubSub } from './PubSub';
import { ServiceManager } from './ServiceManager';
import { ServiceOptionsRepository } from './ServiceOptionsRepository';
import { ServiceRepository } from './ServiceRepository';
import { SystemCommand } from './SystemCommand';
import { SystemSettingsManager } from './SystemSettingsManager';
import { WebComponentsManager } from './WebComponentsManager';
import { WebPageManager } from './WebPageManager';

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
    public readonly webPageManager = new WebPageManager(this.topics, this.config.defaultWebPageOptions);
    public readonly webComponentsManager = new WebComponentsManager(this.topics, this.config.defaultWebComponentOptions);
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

    public async reset(): Promise<void> {
        const appPath = app.getAppPath();
        const cwd = path.join(appPath, '../');
        await SystemCommand.run('rimraf ' + appPath, cwd);
        app.relaunch();
        app.quit();
    }
}