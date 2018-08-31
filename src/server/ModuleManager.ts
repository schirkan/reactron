import * as fs from 'fs';
import * as path from 'path';
import { IBackendServiceConfig } from "../interfaces/IBackendServiceConfig";
import { ICommandResult } from "../interfaces/ICommandResult";
import { IModuleRepositoryItem } from "../interfaces/IModuleRepositoryItem";
import { wrapCall } from './commandResultWrapper';
import { ModuleLoader } from "./ModuleLoader";
import { ModuleRepository } from "./ModuleRepository";
import { SystemCommand } from "./SystemCommand";

export class ModuleManager {
    private modulesRootPath: string;
    private moduleLoader = new ModuleLoader(this.config);

    constructor(
        private config: IBackendServiceConfig,
        private moduleRepository: ModuleRepository,
    ) {
        this.modulesRootPath = path.join(this.config.root, 'modules');

        this.add = wrapCall(this.add);
        this.build = wrapCall(this.build);
        this.update = wrapCall(this.update);
        this.remove = wrapCall(this.remove);
        this.install = wrapCall(this.install);
    }

    public async loadAllModules(): Promise<void> {
        const modules = await this.moduleLoader.loadAllModules();
        modules.forEach(this.moduleRepository.add);
    }

    public getAll(): IModuleRepositoryItem[] {
        return this.moduleRepository.getAll();
    }

    public get(moduleName: string): IModuleRepositoryItem | undefined {
        return this.moduleRepository.get(moduleName);
    }

    public async add(repository: string): Promise<ICommandResult> {
        repository = (repository || '').trim();

        // remove / from end
        if (repository.endsWith('/')) {
            repository = repository.substr(0, repository.length - 1);
        }
        // remove .git from end
        if (repository.endsWith('.git')) {
            repository = repository.substr(0, repository.length - 4);
        }
        if (!repository) {
            throw new Error('Invalid repository');
        }

        const parts = repository.split('/');
        const folderName = parts[parts.length - 1];

        // check destination folder 
        const fullModulePath = path.join(this.modulesRootPath, folderName);
        if (!this.isDirEmpty(fullModulePath)) {
            throw new Error('Destination folder already exists');
        }

        const result = await SystemCommand.run('git clone ' + repository + ' ' + folderName, this.modulesRootPath);

        if (result.success) {
            const moduleDefinition = await this.moduleLoader.loadModule(folderName);
            if (moduleDefinition) {
                moduleDefinition.commandLog.push(result);
                this.moduleRepository.add(moduleDefinition);
            }
        }

        return result;
    }

    public async update(moduleName: string): Promise<ICommandResult> {
        const modulePath = this.getModulePath(moduleName);
        const result = await SystemCommand.run('git pull -n', modulePath);

        const moduleDefinition = this.get(moduleName);
        if (moduleDefinition) {
            moduleDefinition.commandLog.push(result);
        }

        return result;
    }

    public async install(moduleName: string): Promise<ICommandResult> {
        const modulePath = this.getModulePath(moduleName);
        const result = await SystemCommand.run('npm install', modulePath);

        const moduleDefinition = this.get(moduleName);
        if (moduleDefinition) {
            moduleDefinition.isInstalled = moduleDefinition.isInstalled && result.success;
            moduleDefinition.commandLog.push(result);
        }

        return result;
    }

    public async build(moduleName: string): Promise<ICommandResult> {
        const modulePath = this.getModulePath(moduleName);
        const result = await SystemCommand.run('npm run build', modulePath);

        const moduleDefinition = this.get(moduleName);
        if (moduleDefinition) {
            moduleDefinition.isBuilded = moduleDefinition.isBuilded && result.success;
            moduleDefinition.commandLog.push(result);
        }

        return result;
    }

    public remove(moduleName: string): Promise<ICommandResult> {
        const modulePath = this.getModulePath(moduleName);
        this.moduleRepository.remove(moduleName);
        return SystemCommand.run('rimraf ' + modulePath, this.modulesRootPath);
    }

    private isDirEmpty(dirname: string): boolean {
        try {
            const files = fs.readdirSync(dirname);
            return !files.length;
        } catch (error) {
            return true;
        }
    }

    private getModulePath(moduleName: string): string {
        const moduleDefinition = this.get(moduleName);
        if (!moduleDefinition) {
            throw Error("Module '" + moduleName + "' not found.");
        }
        return path.join(this.modulesRootPath, moduleDefinition.folder);
    }
}