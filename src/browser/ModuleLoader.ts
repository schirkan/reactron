import * as SvgCore from '@fortawesome/fontawesome-svg-core';
import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as path from 'path';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IModuleInstance } from '../interfaces/IModuleInstance';

const electron = (window as any).require('electron') as Electron.AllElectron;
const SystemJS = (window as any).SystemJS;

// setup SystemJS
SystemJS.config({
    map: { 'plugin-json': 'node_modules/systemjs-plugin-json/json.js' },
    meta: { '*.json': { loader: 'plugin-json' } }
});
SystemJS.set('electron', SystemJS.newModule(electron));
SystemJS.set('react', SystemJS.newModule(React));
SystemJS.set('react-dom', SystemJS.newModule(ReactDom));
SystemJS.set('@fortawesome/fontawesome-svg-core', SystemJS.newModule(SvgCore));
SystemJS.set('@fortawesome/free-solid-svg-icons', SystemJS.newModule(SvgIcons));
SystemJS.set('@fortawesome/react-fontawesome', SystemJS.newModule(FontAwesome));

export class ModuleLoader {
    public async loadModule(folderName: string): Promise<IModuleInstance> {
        const packageFile = path.join('modules', folderName, 'package.json');
        const p = await SystemJS.import(packageFile);
        console.log(packageFile, p);

        const module = {
            name: p.name,
            author: p.author,
            browserFile: p.browser,
            serverFile: p.main
        } as IModuleInstance;

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
}

export const instance = new ModuleLoader();