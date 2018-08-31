import * as SvgCore from '@fortawesome/fontawesome-svg-core';
import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IDynamicReactComponentClass } from '../interfaces/IDynamicReactComponentClass';
import { BackendService } from '../server/BackendService';

const electron = (window as any).require('electron') as Electron.AllElectron;
const SystemJS = (window as any).SystemJS as SystemJSLoader.System;

// SystemJS.config({
//     map: { 'plugin-json': 'node_modules/systemjs-plugin-json/json.js' },
//     meta: { '*.json': { loader: 'plugin-json' } }
// });
SystemJS.set('electron', SystemJS.newModule(electron));
SystemJS.set('react', SystemJS.newModule(React));
SystemJS.set('react-dom', SystemJS.newModule(ReactDom));
SystemJS.set('@fortawesome/fontawesome-svg-core', SystemJS.newModule(SvgCore));
SystemJS.set('@fortawesome/free-solid-svg-icons', SystemJS.newModule(SvgIcons));
SystemJS.set('@fortawesome/react-fontawesome', SystemJS.newModule(FontAwesome));

export class ComponentLoader {
    public readonly backendService = electron.remote.require('./dist/server/BackendService').BackendService.instance as BackendService;

    public loadComponent(moduleName: string, componentName: string): Promise<IDynamicReactComponentClass | undefined> {
        return new Promise<IDynamicReactComponentClass | undefined>((resolve) => {
            const moduleDefinition = this.backendService.moduleManager.get(moduleName);
            if (moduleDefinition && moduleDefinition.browserFile) {
                SystemJS.import(moduleDefinition.browserFile).then(components => {
                    const component = components[componentName];
                    console.log('Component loaded: ' + moduleName + '.' + componentName);
                    resolve(component);
                });
            } else {
                console.log('Component not found: ' + moduleName + '.' + componentName);
                resolve(undefined);
            }
        });
    };
}

export const instance = new ComponentLoader();