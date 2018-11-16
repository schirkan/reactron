import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IReactronComponentContext } from '@schirkan/reactron-interfaces';
import React from 'react';
import { BrowserModuleContext } from "./BrowserModuleContext";
import Loading from "./components/Loading/Loading";
import WebComponent, { IWebComponentProps } from "./components/WebComponent/WebComponent";

export class WebComponentContext extends BrowserModuleContext implements IReactronComponentContext {
    public renderLoading: (text?: string, iconSize?: SizeProp) => any;
    public renderComponent: (props: IWebComponentProps) => any;

    constructor(moduleName: string, public readonly componentName: string) {
        super(moduleName);

        this.renderComponent = (props: IWebComponentProps) => {
            return <WebComponent {...props} />;
        };

        this.renderLoading = (text?: string, iconSize?: SizeProp) => {
            return <Loading text={text} iconSize={iconSize} />;
        };
    }
}

export const WebComponentContextType = React.createContext<WebComponentContext>(new WebComponentContext('', ''));