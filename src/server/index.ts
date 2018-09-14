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
    const internalModule = await BackendService.instance.moduleLoader.loadModule('../');
    if (internalModule) {
        /*
        internalModule.folder: 'internalModule',
        internalModule.path: './internalModule',
        internalModule.description: 'Internal Module',
        internalModule.author: 'Martin Pietschmann',
        internalModule.canBuild: false,
        internalModule.canUpdate: false,
        internalModule.canInstall: false,
        internalModule.isBuilded: true,
        internalModule.isInstalled: true,
        internalModule.name = 'internal',
        */
        internalModule.canRemove = false;
        internalModule.serverFile = './internalModule/index'
        BackendService.instance.moduleRepository.add(internalModule);
    }

    await BackendService.instance.expressApp.start();
    await BackendService.instance.electronApp.start();
    await BackendService.instance.moduleManager.loadAllModules();
    await BackendService.instance.serviceManager.startAllServices();

    app.on('before-quit', () => BackendService.instance.serviceManager.stopAllServices());
    BackendService.instance.electronApp.mainWindow.loadURL(
        'http://localhost:' + BackendService.instance.config.frontendPort + BackendService.instance.settings.get().startupPath);

    console.log('BackendService is running');
}
