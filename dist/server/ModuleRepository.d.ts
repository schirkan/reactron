import { IModuleRepositoryItem } from "../interfaces/IModuleRepositoryItem";
export declare class ModuleRepository {
    private readonly modules;
    constructor();
    add(module: IModuleRepositoryItem): void;
    remove(moduleName: string): void;
    get(moduleName: string): IModuleRepositoryItem | undefined;
    getAll(): IModuleRepositoryItem[];
}
