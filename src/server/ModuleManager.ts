import { IBackendServiceConfig } from "../interfaces/IBackendServiceConfig";
import { IModuleDefinition } from "../interfaces/IModuleDefinition";
import { IModuleManagerActionResult } from "../interfaces/IModuleManagerActionResult";
import { ModuleRepository } from "./ModuleRepository";

export class ModuleManager {
    private moduleDefinitions: IModuleDefinition[] = [];

    constructor(
        private config: IBackendServiceConfig,
        private moduleRepository: ModuleRepository) { }

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