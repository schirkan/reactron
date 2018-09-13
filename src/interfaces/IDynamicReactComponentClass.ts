import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import * as React from 'react';
import { IWebComponentProps } from '../browser/components/WebComponent/IWebComponentProps';
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
    renderComponent: (props: IWebComponentProps) => any;
    renderLoading: (text?: string, iconSize?: SizeProp) => any;
}

export interface IDynamicReactComponentClass extends React.ComponentClass<IDynamicReactComponentProps> {
}