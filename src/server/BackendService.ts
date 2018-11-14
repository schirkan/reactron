import { IBackendService, IBackendServiceConfig } from '@schirkan/reactron-interfaces';
import { app } from 'electron';
import * as path from 'path';
import { ElectronApp } from './ElectronApp';
import { ExpressApp } from './ExpressApp';
import { ModuleLoader } from './ModuleLoader';
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

export class BackendService implements IBackendService {
    public static instance: BackendService;

    public readonly topics = new PubSub();
    public readonly moduleRepository = new ModuleRepository();
    public readonly serviceRepository = new ServiceRepository();
    public readonly serviceOptionsRepository = new ServiceOptionsRepository();
    public readonly electronApp = new ElectronApp(this.config);
    public readonly expressApp = new ExpressApp(this.config);
    public readonly moduleLoader = new ModuleLoader(this.config);
    public readonly serviceManager = new ServiceManager(this.serviceRepository, this.moduleRepository, this.serviceOptionsRepository);
    public readonly moduleManager = new ModuleManager(this.config, this.moduleRepository, this.moduleLoader);
    public readonly webPageManager = new WebPageManager(this.topics, this.config.defaultWebPageOptions);
    public readonly webComponentsManager = new WebComponentsManager(this.topics, this.config.defaultWebComponentOptions);
    public readonly settings = new SystemSettingsManager(this.topics, this.config.defaultSystemSettings);

    public constructor(public readonly config: IBackendServiceConfig) { }

    public exit(): void {
        this.electronApp.mainWindow.close();
        app.quit();
    }

    public restart(): void {
        app.relaunch();
        app.quit();
    }

    public async reset(): Promise<void> {
        const appPath = app.getPath('userData');
        const cwd = path.join(appPath, '../');
        const result = await SystemCommand.run('rimraf ' + appPath, cwd);
        console.log(result);
        app.relaunch();
        app.quit();
    }
}