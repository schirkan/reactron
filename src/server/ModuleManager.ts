import { IBackendServiceConfig } from "../interfaces/IBackendServiceConfig";
import { IModuleDefinition } from "../interfaces/IModuleDefinition";
import { IModuleManagerActionResult } from "../interfaces/IModuleManagerActionResult";
import { ModuleLoader } from "./ModuleLoader";
import { ModuleRepository } from "./ModuleRepository";

export class ModuleManager {
    private moduleDefinitions: IModuleDefinition[] = [];
    private moduleLoader: ModuleLoader;

    constructor(
        private config: IBackendServiceConfig,
        private moduleRepository: ModuleRepository,
    ) {
        this.moduleLoader = new ModuleLoader(config);
    }

    public async loadAllModules() {        
        // load Modules
        const modules = await this.moduleLoader.loadAllModules();
        this.moduleRepository.modules.push(...modules);

        // load Services
    }

    // git clone - n
    public async add(repository: string): Promise<IModuleManagerActionResult> {
        const result = {
            command: 'add',
            args: repository,
            timestampStart: Date.now()
        } as IModuleManagerActionResult;

        // TODO

        result.timestampEnd = Date.now();
        return result;
    }

    // git pull - n
    public async update(moduleName: string): Promise<IModuleManagerActionResult> {
        const result = {
            command: 'add',
            args: moduleName,
            timestampStart: Date.now()
        } as IModuleManagerActionResult;

        // TODO

        result.timestampEnd = Date.now();
        return result;
    }

    // npm install
    public async install(moduleName: string): Promise<IModuleManagerActionResult> {
        const result = {
            command: 'add',
            args: moduleName,
            timestampStart: Date.now()
        } as IModuleManagerActionResult;

        // TODO

        result.timestampEnd = Date.now();
        return result;
    }

    //  npm run build
    public async build(moduleName: string): Promise<IModuleManagerActionResult> {
        const result = {
            command: 'build',
            args: moduleName,
            timestampStart: Date.now()
        } as IModuleManagerActionResult;

        // TODO

        result.timestampEnd = Date.now();
        return result;
    }

    // rm folder
    public remove(moduleName: string) {
        const result = {
            command: 'remove',
            args: moduleName,
            timestampStart: Date.now()
        } as IModuleManagerActionResult;

        // TODO

        result.timestampEnd = Date.now();
        return result;
    }

    public getModuleDefinitions(): IModuleDefinition[] {
        return this.moduleDefinitions;
    }
}