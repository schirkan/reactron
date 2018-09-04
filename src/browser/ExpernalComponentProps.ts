import { BrowserModuleHelper } from "./BrowserModuleHelper";

export class ExpernalComponentProps extends BrowserModuleHelper {
    constructor(moduleName: string, public componentName: string) {
        super(moduleName);

        this.options = { initialText: 'Hello World' } // TODO from component options repo
    }
    // TODO: load options
    public readonly options: any;
}