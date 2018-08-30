import { IExternalService } from '../interfaces/IExternalService';

export class ServiceRepository {
    private readonly services: { [key: string]: IExternalService} = {};

    constructor(){
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
    }

    public add(moduleName: string, serviceName: string, instance: IExternalService): void {
        const key = moduleName + '.' + serviceName;
        if (this.services[key]) {
            throw Error('Service allready registered: ' + key);
        }
        this.services[key] = instance;
    }

    public remove(moduleName: string, serviceName: string): void {
        const key = moduleName + '.' + serviceName;
        delete (this.services[key]);
    }

    public get(moduleName: string, serviceName: string): IExternalService | undefined {
        const key = moduleName + '.' + serviceName;
        return this.services[key];
    }

    public getAll(moduleName?: string): { [key: string]: IExternalService } {
        if (moduleName) {
            const result: { [key: string]: IExternalService } = {};
            const foundKeys = Object.keys(this.services).filter(x => x.startsWith(moduleName + '.'));
            if (foundKeys) {
                foundKeys.forEach(key => {
                    result[key] = this.services[key];
                });
            }
            return result;
        }
        return Object.assign({}, this.services); // copy
    }
}