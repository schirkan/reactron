import * as SvgCore from '@fortawesome/fontawesome-svg-core';
import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as path from 'path';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as Loadable from 'react-loadable';
import { ExternalModule } from './ExternalModule';

const electron = (window as any).require('electron') as Electron.AllElectron;
const SystemJS = (window as any).SystemJS;

// setup SystemJS
SystemJS.config({
  map: { 'plugin-json': 'node_modules/systemjs-plugin-json/json.js' },
  meta: { '*.json': { loader: 'plugin-json' } }
});
SystemJS.set('react', SystemJS.newModule(React));
SystemJS.set('react-dom', SystemJS.newModule(ReactDom));
SystemJS.set('@fortawesome/fontawesome-svg-core', SystemJS.newModule(SvgCore));
SystemJS.set('@fortawesome/free-solid-svg-icons', SystemJS.newModule(SvgIcons));
SystemJS.set('@fortawesome/react-fontawesome', SystemJS.newModule(FontAwesome));

export const loadComponent = <TProps extends object = any, TExports extends object = any>(from: string, component: string = 'default') => Loadable<TProps, TExports>({
  loader: () => SystemJS.import(from).then((m: any) => {
    console.log(from, m);
    return m[component];
  }),
  loading: (props: any) => {
    if (props.error) {
      return <div>Error! <button onClick={props.retry}>Retry</button></div>;
    } else if (props.pastDelay) {
      return <div>Loading...</div>;
    } else {
      return null;
    }
  },
});

export const loadModule = async (folderName: string): Promise<ExternalModule> => {
  const packageFile = path.join('modules', folderName, 'package.json');
  const p = await SystemJS.import(packageFile);
  console.log(packageFile, p);

  const module = new ExternalModule();

  module.name = p.name;
  module.author = p.author;
  module.browserFile = p.browser;
  module.serverFile = p.main;

  if (module.browserFile) {
    module.browserFile = './' + path.join('modules', folderName, module.browserFile);
    module.components = await SystemJS.import(module.browserFile);
  }

  if (module.serverFile) {
    module.serverFile = './' + path.join('modules', folderName, module.serverFile);
    module.services = await electron.remote.require(module.serverFile);
  }

  console.log(folderName, module);
  return module;
};

