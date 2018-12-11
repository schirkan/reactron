import * as SvgCore from '@fortawesome/fontawesome-svg-core';
import * as BrandIcons from '@fortawesome/free-brands-svg-icons';
import * as RegularIcons from '@fortawesome/free-regular-svg-icons';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import { IComponentLoader, IModuleRepositoryItem, IReactronComponentDefinition } from '@schirkan/reactron-interfaces';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import numeral from 'numeral';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as ReactRouterDom from 'react-router-dom';
import { apiClient } from './ApiClient';
import { inernalModuleContext } from './inernalModuleContext';
import { components as internalComponents } from "./internalModule";

// tslint:disable:no-string-literal

const SystemJS = (window as any).System as SystemJSLoader.System;

const externalModules = {};
externalModules['react'] = React;
externalModules['react-dom'] = ReactDom;
externalModules['react-router-dom'] = ReactRouterDom;
externalModules['numeral'] = { default: numeral };
externalModules['moment'] = { default: moment };
externalModules['moment-timezone'] = { default: momentTimezone };
externalModules['@fortawesome/fontawesome-svg-core'] = SvgCore;
externalModules['@fortawesome/free-solid-svg-icons'] = SolidIcons;
externalModules['@fortawesome/free-regular-svg-icons'] = RegularIcons;
externalModules['@fortawesome/free-brands-svg-icons'] = BrandIcons;
externalModules['@fortawesome/react-fontawesome'] = FontAwesome;

if (inernalModuleContext.electron) {
  externalModules['electron'] = inernalModuleContext.electron;
}

Object.keys(externalModules).forEach(key => {
  const moduleExport = externalModules[key];
  SystemJS.register(key, [], exports => ({ execute: () => exports(moduleExport) }));
});

export class ComponentLoader implements IComponentLoader {
  private allComponentsLoaded = false;
  private moduleComponents: { [moduleName: string]: IReactronComponentDefinition[] } = {
    'reactron': internalComponents
  };

  public async getModuleComponents(moduleName: string): Promise<IReactronComponentDefinition[] | undefined> {
    if (!this.moduleComponents[moduleName]) {
      const modules = await apiClient.getModules();
      const m = modules.find(x => x.name === moduleName);

      if (!m) {
        console.error('Module not found: ' + moduleName);
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
      console.error('Error loading components for module: ' + m.name, error);
    }
  }

  public async getAllComponents(): Promise<{ [moduleName: string]: IReactronComponentDefinition[] }> {
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