import { IDynamicReactComponentProps } from "../interfaces/IDynamicReactComponentClass";
import { BrowserModuleHelper } from "./BrowserModuleHelper";

export class DynamicReactComponentProps extends BrowserModuleHelper implements IDynamicReactComponentProps {
    constructor(moduleName: string, public readonly componentName: string, public readonly options: any) {
        super(moduleName);
    }
}