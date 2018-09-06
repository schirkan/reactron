import * as SvgCore from '@fortawesome/fontawesome-svg-core';
import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IDynamicReactComponentClass } from '../interfaces/IDynamicReactComponentClass';
import { IModuleRepositoryItem } from '../interfaces/IModuleRepositoryItem';
import { IWebComponentOptions } from '../interfaces/IWebComponentOptions';
import { BrowserModuleHelper } from './BrowserModuleHelper';

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

export class ComponentLoader {
    public async loadComponent(id: string): Promise<IDynamicReactComponentClass | undefined> {
        const webComponents = await this.getComponents();       
        const modules = await this.getModules();

        const webComponentOptions = webComponents.find(x => x.id === id);

        if (!webComponentOptions) {
            console.log('ComponentOptions not found: ' + id);
            return;
        }

        const moduleName = webComponentOptions.moduleName;
        const componentName = webComponentOptions.componentName;
        const m = modules.find(x => x.name === moduleName);

        if (!m) {
            console.log('Module not found loaded: ' + moduleName);
            return;
        }

        if (!m.browserFile) {
            console.log('Module has no browserFile: ' + moduleName);
            return;
        }

        let component: IDynamicReactComponentClass | undefined;
        try {
            const moduleComponents = await SystemJS.import(m.browserFile);
            component = moduleComponents[componentName];
            console.log('Component loaded: ' + moduleName + '.' + componentName);
        } catch (error) {
            console.log('Component not found: ' + moduleName + '.' + componentName);
        }
        return component;
    };

    private modules: IModuleRepositoryItem[];

    private async getModules() {
        if (!this.modules) {
            const response = await fetch(inernalApiModuleHelper.moduleApiPath + '/modules');
            this.modules = await response.json();
        }
        return this.modules;
    }

    private components: IWebComponentOptions[];

    private async getComponents() {
        if (!this.components) {
            const response = await fetch(inernalApiModuleHelper.moduleApiPath + '/components');
            this.components = await response.json();
        }
        return this.components;
    }
}

export const instance = new ComponentLoader();