import * as React from 'react';
import { IPubSub } from './IPubSub';

export interface IDynamicReactComponentProps {
    electron: Electron.AllElectron;
    backendService: any; // TODO
    topics: IPubSub;
    moduleStorage: ElectronStore;
    moduleApiPath: string;
    getService: (serviceName: string, moduleName: string | undefined) => Promise<any>;
    options: any;
}

export interface IDynamicReactComponentClass extends React.ComponentClass<IDynamicReactComponentProps> {
}