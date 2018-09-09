import * as SvgCore from '@fortawesome/fontawesome-svg-core';
import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IComponentDefinition } from '../interfaces/IComponentDefinition';
import { IModuleRepositoryItem } from '../interfaces/IModuleRepositoryItem';
import { IWebComponentOptions } from '../interfaces/IWebComponentOptions';
import { IWebPageOptions } from '../interfaces/IWebPageOptions';
import { BrowserModuleHelper } from './BrowserModuleHelper';
import { components as internalComponents } from "./internalModule";

const inernalApiModuleHelper = new BrowserModuleHelper('internal');

const SystemJS = (window as any).SystemJS as SystemJSLoader.System;
if (inernalApiModuleHelper.electron) {
    SystemJS.set('electron', SystemJS.newModule(inernalApiModuleHelper.electron));
}
SystemJS.set('react', SystemJS.newModule(React));
SystemJS.set('react-dom', SystemJS.newModule(ReactDom));
SystemJS.set('@fortawesome/fontawesome-svg-core', SystemJS.newModule(SvgCore));
SystemJS.set('@fortawesome/free-solid-svg-icons', SystemJS.newModule(SvgIcons));
SystemJS.set('@fortawesome/react-fontawesome', SystemJS.newModule(FontAwesome));

export class ClientRepository {
    private modules: IModuleRepositoryItem[];

    public async getModules(): Promise<IModuleRepositoryItem[]> {
        if (!this.modules) {
            const response = await fetch(inernalApiModuleHelper.moduleApiPath + '/modules');
            this.modules = await response.json();
        }
        return this.modules;
    }

    private webPages: IWebPageOptions[];

    public async getWebPages(): Promise<IWebPageOptions[]> {
        if (!this.webPages) {
            const response = await fetch(inernalApiModuleHelper.moduleApiPath + '/pages');
            this.webPages = await response.json();
        }
        return this.webPages;
    }

    private webComponents: IWebComponentOptions[];

    public async getWebComponentOptions(): Promise<IWebComponentOptions[]> {
        if (!this.webComponents) {
            const response = await fetch(inernalApiModuleHelper.moduleApiPath + '/components');
            this.webComponents = await response.json();
        }
        return this.webComponents;
    }

    private moduleComponents: { [moduleName: string]: IComponentDefinition[] } = {
        internal: internalComponents
    };

    public async getModuleComponents(moduleName: string): Promise<IComponentDefinition[] | undefined> {
        if (!this.moduleComponents[moduleName]) {
            const modules = await this.getModules();
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
                const browserFileContent = await SystemJS.import(m.browserFile);
                // tslint:disable-next-line:no-string-literal
                const components = browserFileContent['components'];

                if (components && typeof components === 'object' && Array.isArray(components)) {
                    this.moduleComponents[moduleName] = components;
                }
                console.log('Components loaded for module: ' + moduleName);
            } catch (error) {
                console.log('Error loading components for module: ' + moduleName);
            }
        }

        return this.moduleComponents[moduleName];
    }
}

export const instance = new ClientRepository();