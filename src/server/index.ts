import { app } from 'electron';
import { IBackendServiceConfig } from '../interfaces/IBackendServiceConfig';
import { IDashboardOptions } from '../interfaces/IDashboardOptions';
import { BackendService } from "./BackendService";

export const start = async (root: string): Promise<void> => {
    if (BackendService.instance) {
        return;
    }
    const isDev = process.env.NODE_ENV === 'development';
    const config: IBackendServiceConfig = {
        root,
        isDev,
        frontendPort: 3000,
        backendPort: isDev ? 5000 : 3000,
        defaultSystemSettings: {
            lang: 'de',
            location: '',
            theme: 'default',
            timezone: 'Europe/Berlin'
        },
        defaultDashboardOptions: {
            layout: { gridCols: 3, gridRows: 3 },
            tiles: [{
                id: "1",
                components: [{
                    componentName: 'HelloWorld',
                    moduleName: 'dynamic-electron-react-module-example',
                    options: { initialText: 'Hello World' }
                }],
                layout: {
                    col: 1,
                    row: 1,
                    colspan: 1,
                    rowspan: 1
                }
            }]
        } as IDashboardOptions
    };

    console.log('BackendService is starting', config);

    BackendService.instance = new BackendService(config);

    // register internal api module
    BackendService.instance.moduleRepository.add({
        name: 'internal',
        folder: 'apiModule',
        path: './apiModule',
        description: 'Internal Api Module',
        author: 'Martin Pietschmann',
        canRemove: false,
        canBuild: false,
        canUpdate: false,
        canInstall: false,
        isBuilded: true,
        isInstalled: true,
        commandLog: [],
        serverFile: './apiModule/index'
    });

    await BackendService.instance.expressApp.start();
    await BackendService.instance.electronApp.start();
    await BackendService.instance.moduleManager.loadAllModules();
    await BackendService.instance.serviceManager.startAllServices();

    app.on('before-quit', () => BackendService.instance.serviceManager.stopAllServices());
    BackendService.instance.electronApp.mainWindow.loadURL(
        'http://localhost:' + BackendService.instance.config.frontendPort);

    console.log('BackendService is running');
}
