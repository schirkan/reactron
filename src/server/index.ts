import { app } from 'electron';
import { BackendService } from "./BackendService";

export const start = async (root: string): Promise<void> => {
    if (BackendService.instance) {
        return;
    }
    const isDev = process.env.NODE_ENV === 'development';
    const config = {
        root,
        isDev,
        frontendPort: 3000,
        backendPort: isDev ? 5000 : 3000
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
