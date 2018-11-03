import * as SvgCore from '@fortawesome/fontawesome-svg-core';
import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IModuleRepositoryItem } from 'src/interfaces/IModuleRepositoryItem';
import { IComponentDefinition } from '../interfaces/IComponentDefinition';
import { apiClient } from './ApiClient';
import { inernalModuleHelper } from './inernalModuleHelper';
import { components as internalComponents } from "./internalModule";

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
    private allComponentsLoaded = false;
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

            await this.registerModuleComponents(m);
        }

        return this.moduleComponents[moduleName];
    }

    private async registerModuleComponents(m: IModuleRepositoryItem): Promise<void> {
        if (!m.browserFile) {
            console.log('Module has no browserFile: ' + m.name);
            return;
        }

        if (this.moduleComponents[m.name]) {
            return;
        }

        try {
            console.log(m.browserFile);

            const browserFileContent = await SystemJS.import('\\' + m.browserFile);
            // tslint:disable-next-line:no-string-literal
            const components = browserFileContent['components'];

            if (components && typeof components === 'object' && Array.isArray(components)) {
                this.moduleComponents[m.name] = components;
            }
            console.log('Components loaded for module: ' + m.name);
        } catch (error) {
            console.log('Error loading components for module: ' + m.name, error);
        }
    }

    public async getAllComponents(): Promise<{ [moduleName: string]: IComponentDefinition[] }> {
        if (this.allComponentsLoaded) {
            return this.moduleComponents;
        }
        const modules = await apiClient.getModules();
        for (const m of modules) {
            await this.registerModuleComponents(m);
        }
        this.allComponentsLoaded = true;
        return this.moduleComponents;
    }
}

export const componentLoader = new ComponentLoader();