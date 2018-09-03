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

        this.add = wrapCall(this.add.bind(this), 'add');
        this.build = wrapCall(this.build.bind(this), 'build');
        this.update = wrapCall(this.update.bind(this), 'update');
        this.remove = wrapCall(this.remove.bind(this), 'remove');
        this.install = wrapCall(this.install.bind(this), 'install');
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
        const moduleDefinition = this.get(moduleName);
        
        if (!moduleDefinition || !moduleDefinition.canUpdate) {
            throw new Error('Can not update module');
        }

        const result = await SystemCommand.run('git pull -n', moduleDefinition.path);
        moduleDefinition.commandLog.push(result);
        return result;
    }

    public async install(moduleName: string): Promise<ICommandResult> {
        const moduleDefinition = this.get(moduleName);
        
        if (!moduleDefinition || !moduleDefinition.canInstall) {
            throw new Error('Can not install module');
        }

        const result = await SystemCommand.run('npm install', moduleDefinition.path);
        moduleDefinition.isInstalled = moduleDefinition.isInstalled && result.success;
        moduleDefinition.commandLog.push(result);
        return result;
    }

    public async build(moduleName: string): Promise<ICommandResult> {
        const moduleDefinition = this.get(moduleName);
        
        if (!moduleDefinition || !moduleDefinition.canBuild) {
            throw new Error('Can not build module');
        }

        const result = await SystemCommand.run('npm run build', moduleDefinition.path);
        moduleDefinition.isBuilded = moduleDefinition.isBuilded && result.success;
        moduleDefinition.commandLog.push(result);
        return result;
    }

    public remove(moduleName: string): Promise<ICommandResult> {
        const moduleDefinition = this.get(moduleName);
        
        if (!moduleDefinition || !moduleDefinition.canRemove) {
            throw new Error('Can not remove module');
        }

        this.moduleRepository.remove(moduleName);
        return SystemCommand.run('rimraf ' + moduleDefinition.path, this.modulesRootPath);
    }

    private isDirEmpty(dirname: string): boolean {
        try {
            const files = fs.readdirSync(dirname);
            return !files.length;
        } catch (error) {
            return true;
        }
    }
}