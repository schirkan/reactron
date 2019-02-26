import { IBackendServiceConfig } from '@schirkan/reactron-interfaces';
import { isPortAvailable } from './lib/isPortAvailable';

export const createConfig = async (root: string): Promise<IBackendServiceConfig> => {
  const isDev = process.env.NODE_ENV === 'development';
  const port80available = await isPortAvailable(80);
  const defaultPort = port80available ? 80 : 3000;

  return {
    root,
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