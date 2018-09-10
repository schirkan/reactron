import { app } from 'electron';
import { IBackendServiceConfig } from '../interfaces/IBackendServiceConfig';
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
            timezone: 'Europe/Berlin',
            startupPath: '/'
        },
        defaultWebPageOptions: [{
            title: 'Home',
            path: '/',
            webComponentId: '1-list'
        }],
        defaultWebComponentOptions: [{
            id: '1-list',
            componentName: 'ListLayout',
            moduleName: 'internal',
            options: {
                items: [{
                    content: "2"
                }, {
                    content: "3",
                    style: {
                        background: '#D9EEFC',
                        padding: '20px',
                        minHeight: '100px'
                    }
                }, {
                    content: "4",
                    style: {
                        background: '#aaffc3',
                        padding: '20px',
                        minHeight: '100px'
                    }                
                }, {
                    content: "iframe-weather",
                    style: {
                        background: '#ffaac3',
                        padding: '20px',
                        minHeight: '100px'
                    }
                }]
            }
        }, {
            id: '1-grid',
            componentName: 'GridLayout',
            moduleName: 'internal',
            options: {
                layout: { gridCols: 3, gridRows: 3 },
                tiles: [{
                    content: "2",
                    layout: { col: 1, row: 1, colspan: 1, rowspan: 1 }
                }, {
                    content: "3",
                    layout: { col: 3, row: 1, colspan: 1, rowspan: 1 }
                }]
            }
        }, {
            id: '2',
            componentName: 'Welcome',
            moduleName: 'internal'
        }, {
            id: '3',
            componentName: 'HelloWorld',
            moduleName: 'dynamic-electron-react-module-example',
            options: { initialText: 'Hello World' }
        }, {
            id: '4',
            componentName: 'HelloWorld',
            moduleName: 'dynamic-electron-react-module-example',
            options: { initialText: 'Hello Mars' }
        }, {
            id: 'iframe-weather',
            componentName: 'WebPage',
            moduleName: 'internal',
            options: { url: 'https://wetter.tagesschau.de/deutschland/aussichten.html#aussichten' }
        }]
    };

    console.log('BackendService is starting', config);

    BackendService.instance = new BackendService(config);

    // register internal module
    BackendService.instance.moduleRepository.add({
        name: 'internal',
        folder: 'internalModule',
        path: './internalModule',
        description: 'Internal Module',
        author: 'Martin Pietschmann',
        canRemove: false,
        canBuild: false,
        canUpdate: false,
        canInstall: false,
        isBuilded: true,
        isInstalled: true,
        commandLog: [],
        serverFile: './internalModule/index'
    });

    await BackendService.instance.expressApp.start();
    await BackendService.instance.electronApp.start();
    await BackendService.instance.moduleManager.loadAllModules();
    await BackendService.instance.serviceManager.startAllServices();

    app.on('before-quit', () => BackendService.instance.serviceManager.stopAllServices());
    BackendService.instance.electronApp.mainWindow.loadURL(
        'http://localhost:' + BackendService.instance.config.frontendPort + BackendService.instance.settings.get().startupPath);

    console.log('BackendService is running');
}
