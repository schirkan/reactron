import { IModuleRepositoryItem } from "../interfaces/IModuleRepositoryItem";

export class ModuleRepository {
    private readonly modules: IModuleRepositoryItem[] = [];

    constructor(){
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
    }

    public add(module: IModuleRepositoryItem): void {
        if (this.get(module.name)) {
            throw Error('Module allready registered: ' + module.name);
        }
        this.modules.push(module);
    }

    public remove(moduleName: string): void {
        const index = this.modules.findIndex(x => x.name === moduleName);
        if (index >= 0) {
            this.modules.splice(index);
        }
    }

    public get(moduleName: string): IModuleRepositoryItem | undefined {
        return this.modules.find(x => x.name === moduleName);
    }

    public getAll(): IModuleRepositoryItem[] {
        return this.modules.slice(); // copy
    }
}