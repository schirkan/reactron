import { app } from 'electron';
import { BackendService } from "./BackendService";
import { createConfig } from './config';

export const start = async (root: string): Promise<void> => {
    if (BackendService.instance) {
        return;
    }

    console.log('BackendService is starting');

    const config = createConfig(root);
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
