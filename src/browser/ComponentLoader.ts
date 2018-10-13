import * as SvgCore from '@fortawesome/fontawesome-svg-core';
import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IComponentDefinition } from '../interfaces/IComponentDefinition';
import { apiClient } from './ApiClient';
import { BrowserModuleHelper } from './BrowserModuleHelper';
import { components as internalComponents } from "./internalModule";

const inernalModuleHelper = new BrowserModuleHelper('reactron'); // internal module
const SystemJS = (window as any).System as SystemJSLoader.System;

const oldResolve = SystemJS.resolve;
SystemJS.resolve = async (dep: string, id: string) => {
    let result: string;
    try {
        result = await oldResolve.call(SystemJS, dep, id);
    } catch (error) {
        result = 'bundle:' + dep;
    }
    console.log('SystemJS.resolve', dep, id, result);
    return result;
};

if (inernalModuleHelper.electron) {
    SystemJS.register('electron', [], exports => ({ execute: () => exports(inernalModuleHelper.electron) }));
}

SystemJS.register('react', [], exports => ({ execute: () => exports(React) }));
SystemJS.register('react-dom', [], exports => ({ execute: () => exports(ReactDom) }));
SystemJS.register('@fortawesome/fontawesome-svg-core', [], exports => ({ execute: () => exports(SvgCore) }));
SystemJS.register('@fortawesome/free-solid-svg-icons', [], exports => ({ execute: () => exports(SvgIcons) }));
SystemJS.register('@fortawesome/react-fontawesome', [], exports => ({ execute: () => exports(FontAwesome) }));

export class ComponentLoader {
    private moduleComponents: { [moduleName: string]: IComponentDefinition[] } = {
        'reactron': internalComponents
    };

    public async getModuleComponents(moduleName: string): Promise<IComponentDefinition[] | undefined> {
        if (!this.moduleComponents[moduleName]) {
            const modules = await apiClient.getModules();
            const m = modules.find(x => x.name === moduleName);

            if (!m) {
                console.log('Module not found loaded: ' + moduleName);
                return;
            }

            if (!m.browserFile) {
                console.log('Module has no browserFile: ' + moduleName);
                return;
            }

            try {
                console.log(m.browserFile);

                // const url = await SystemJS.get(m.browserFile);
                // console.log(url);

                const browserFileContent = await SystemJS.import('\\' + m.browserFile);
                // tslint:disable-next-line:no-string-literal
                const components = browserFileContent['components'];

                if (components && typeof components === 'object' && Array.isArray(components)) {
                    this.moduleComponents[moduleName] = components;
                }
                console.log('Components loaded for module: ' + moduleName);
            } catch (error) {
                console.log('Error loading components for module: ' + moduleName, error);
            }
        }

        return this.moduleComponents[moduleName];
    }
}

export const componentLoader = new ComponentLoader();