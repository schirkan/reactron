import { IServiceRepositoryItem } from '../interfaces/IServiceRepositoryItem';

export class ServiceRepository {
    private readonly services: IServiceRepositoryItem[] = [];

    constructor(){
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
    }

    public add(service: IServiceRepositoryItem): void {
        if (this.get(service.moduleName, service.name)) {
            throw Error('Service allready registered: ' + service.name);
        }
        this.services.push(service);
    }

    public remove(moduleName: string, serviceName: string): void {
        const index = this.services.findIndex(x => x.moduleName === moduleName && x.name === serviceName);
        if (index >= 0) {
            this.services.splice(index);
        }
    }

    public get(moduleName: string, serviceName: string): IServiceRepositoryItem | undefined {
        return this.services.find(x => x.moduleName === moduleName && x.name === serviceName);
    }

    public getAll(): IServiceRepositoryItem[] {
        return this.services.slice(); // copy
    }
}