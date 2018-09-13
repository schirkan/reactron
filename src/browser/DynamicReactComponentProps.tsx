import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import * as React from "react";
import { IDynamicReactComponentProps } from "../interfaces/IDynamicReactComponentClass";
import { BrowserModuleHelper } from "./BrowserModuleHelper";
import Loading from "./components/Loading/Loading";
import { IWebComponentProps } from './components/WebComponent/IWebComponentProps';
import WebComponent from "./components/WebComponent/WebComponent";

export class DynamicReactComponentProps extends BrowserModuleHelper implements IDynamicReactComponentProps {
    public renderLoading: (text?: string, iconSize?: SizeProp) => any;
    public renderComponent: (props: IWebComponentProps) => any;

    constructor(moduleName: string, public readonly componentName: string, public readonly options: any) {
        super(moduleName);

        this.renderComponent = (props: IWebComponentProps) => {
            return <WebComponent {...props} />;
        };

        this.renderLoading = (text?: string, iconSize?: SizeProp) => {
            return <Loading text={text} iconSize={iconSize} />;
        };
    }
}