import { IModuleDefinition } from "../interfaces/IModuleDefinition";

export class ModuleRepository {
    private readonly modules: IModuleDefinition[] = [];

    constructor(){
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
    }

    public add(module: IModuleDefinition): void {
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

    public get(moduleName: string): IModuleDefinition | undefined {
        return this.modules.find(x => x.name === moduleName);
    }

    public getAll(): IModuleDefinition[] {
        return this.modules.slice(); // copy
    }
}