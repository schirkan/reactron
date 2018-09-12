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
            webComponentId: 'mylist',
            style: {
                'background-color': '#444',
                'color': '#fff'
            }
        }],
        defaultWebComponentOptions: [{
            id: 'mylist',
            componentName: 'ListLayout',
            moduleName: 'internal',
            options: {
                items: [
                    { content: "welcome" },
                    { content: "mygrid", style: { 'padding': '10px' } },
                    { content: "notfound" }
                ]
            }
        }, {
            id: 'mygrid',
            componentName: 'GridLayout',
            moduleName: 'internal',
            options: {
                cols: 2,
                rows: 2,
                gridStyle: {
                    'grid-gap': '10px',
                },
                tileStyle: {
                    'border-radius': '5px',
                    'border': '3px solid white',
                    'padding': '10px'
                },
                tiles: [
                    { content: "hello1", col: 1, row: 1, colspan: 1, rowspan: 1 },
                    { content: "hello2", col: 1, row: 2, colspan: 1, rowspan: 1 },
                    { content: "iframe-weather", col: 2, row: 1, colspan: 1, rowspan: 2, style: { height: "200px" } }
                ]
            }
        }, {
            id: 'welcome',
            componentName: 'Welcome',
            moduleName: 'internal'
        }, {
            id: 'hello1',
            componentName: 'HelloWorld',
            moduleName: 'reactron-hello-world',
            options: { initialText: 'Hello World' }
        }, {
            id: 'hello2',
            componentName: 'HelloWorld',
            moduleName: 'reactron-hello-world',
            options: { initialText: 'Hello Mars' }
        }, {
            id: 'iframe-weather',
            componentName: 'IFrame',
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
