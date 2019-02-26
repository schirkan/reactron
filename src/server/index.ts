import { app } from 'electron';
import { BackendService } from "./BackendService";
import { createConfig } from './config';

export const start = async (root: string): Promise<void> => {
  if (BackendService.instance) {
    return;
  }

  console.log('BackendService is starting');

  const config = await createConfig(root);
  BackendService.instance = new BackendService(config);

  await BackendService.instance.expressApp.start();
  await BackendService.instance.electronApp.start();

  // register internal module
  const internalModule = await BackendService.instance.moduleLoader.loadModule('../');
  if (internalModule) {
    internalModule.canRemove = false;
    internalModule.serverFile = './internalModule/index'
    BackendService.instance.moduleRepository.add(internalModule);
  }

  await BackendService.instance.moduleManager.loadAllModules();
  await BackendService.instance.serviceManager.startAllServices();

  BackendService.instance.expressApp.registerErrorHandler();

  app.on('before-quit', () => BackendService.instance.serviceManager.stopAllServices());
  BackendService.instance.electronApp.mainWindow.loadURL(
    'http://localhost:' + BackendService.instance.config.frontendPort + BackendService.instance.settings.get().startupPath);

  console.log('BackendService is running');
}
