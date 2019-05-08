import { IBackendServiceConfig } from '@schirkan/reactron-interfaces';
import { isPortAvailable } from './lib/isPortAvailable';
import * as path from 'path';
import * as fs from 'fs';

const findNodeModules = (root: string): string | undefined => {
  const folder = path.join(root, 'node_modules');
  if (fs.existsSync(folder)) {
    return folder;
  }
  const newRoot = path.join(root, '..');
  if (newRoot === root) {
    return undefined;
  }
  return findNodeModules(newRoot);
};

export const createConfig = async (root: string): Promise<IBackendServiceConfig> => {
  const isDev = process.env.NODE_ENV === 'development';
  const port80available = await isPortAvailable(80);
  const defaultPort = port80available ? 80 : 3000;
  const reactronIsNpmModule = root.includes('node_modules');
  const nodeModulesFolder = findNodeModules(root);

  if (nodeModulesFolder === undefined) {
    throw new Error('nodeModulesFolder is undefined');
  }

  return {
    root,
    modulesRootPath: reactronIsNpmModule ? path.join(nodeModulesFolder, '..') : path.join(root, 'modules'),
    nodeModulesPath: nodeModulesFolder,
    isDev,
    frontendPort: defaultPort,
    backendPort: isDev ? 5000 : defaultPort,
    defaultSystemSettings: {
      lang: 'en',
      location: '',
      timezone: 'Europe/Berlin',
      startupPath: '/',
      autorefresh: []
    },
    defaultWebPageOptions: [{
      id: 'homepage',
      title: 'Home',
      path: '/',
      webComponentId: 'welcome',
      style: {
        backgroundColor: '#000',
        color: '#fff'
      }
    }],
    defaultWebComponentOptions: [{
      id: 'welcome',
      parentId: 'homepage',
      componentName: 'Welcome',
      moduleName: 'reactron'
    }]
  }
};