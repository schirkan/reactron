import { ServiceManager } from "./ServiceManager";

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class OptionsRepository {
    private repository: ElectronStore = new Store({
        name: 'OptionsRepository',
    });

    public getServiceOptions(moduleName: string, serviceName: string): any {
        const key = moduleName + '.service.' + serviceName;
        return this.repository.get(key);
    }

    public getComponentOptions(moduleName: string, componentName: string): any {
        const key = moduleName + '.component.' + componentName;
        return this.repository.get(key);
    }

    public setServiceOptions(moduleName: string, serviceName: string, options: any): void {
        const key = moduleName + '.service.' + serviceName;
        this.repository.set(key, options);
    }

    public setComponentOptions(moduleName: string, componentName: string, options: any): void {
        const key = moduleName + '.component.' + componentName;
        this.repository.set(key, options);
    }
}