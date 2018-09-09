import * as React from 'react';
import { IPubSub } from './IPubSub';

export interface IDynamicReactComponentProps<TOptions = any> {
    electron: Electron.AllElectron;
    backendService: any; // TODO
    topics: IPubSub;
    moduleStorage: ElectronStore;
    moduleApiPath: string;
    options: TOptions;
    moduleName: string;
    componentName: string;
    getService: (serviceName: string, moduleName: string | undefined) => Promise<any>;
    renderWebComponent: (id: string) => any;
    renderLoading: (text?: string) => any;
}

export interface IDynamicReactComponentClass extends React.ComponentClass<IDynamicReactComponentProps> {
}