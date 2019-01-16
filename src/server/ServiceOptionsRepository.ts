import { ElectronStore } from "@schirkan/reactron-interfaces";

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class ServiceOptionsRepository {
    private repository: ElectronStore = new Store({
        name: 'ServiceOptionsRepository',
    });

    public get(moduleName: string, serviceName: string): any {
        const key = moduleName + '.' + serviceName;
        return this.repository.get(key);
    }

    public set(moduleName: string, serviceName: string, options: any): void {
        const key = moduleName + '.' + serviceName;
        this.repository.set(key, options);
    }
}