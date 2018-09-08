import * as React from "react";
import { IDynamicReactComponentProps } from "../interfaces/IDynamicReactComponentClass";
import { BrowserModuleHelper } from "./BrowserModuleHelper";
import WebComponent from "./components/WebComponent/WebComponent";

export class DynamicReactComponentProps extends BrowserModuleHelper implements IDynamicReactComponentProps {
    public renderWebComponent: (id: string) => any;

    constructor(moduleName: string, public readonly componentName: string, public readonly options: any) {
        super(moduleName);

        this.renderWebComponent = (id: string) => {
            return <WebComponent id={id} />;
        };
    }
}