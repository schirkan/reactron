import * as fs from 'fs';
import * as path from 'path';
import { IBackendServiceConfig } from "../interfaces/IBackendServiceConfig";
import { ICommandResult, ICommandResultWithData } from "../interfaces/ICommandResult";
import { IModuleRepositoryItem } from "../interfaces/IModuleRepositoryItem";
import { command } from './commandResultWrapper';
import { ModuleLoader } from "./ModuleLoader";
import { ModuleRepository } from "./ModuleRepository";
import { SystemCommand } from "./SystemCommand";

export class ModuleManager {
    private modulesRootPath: string;

    constructor(
        private config: IBackendServiceConfig,
        private moduleRepository: ModuleRepository,
        private moduleLoader: ModuleLoader,
    ) {
        this.modulesRootPath = path.join(this.config.root, 'modules');
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

    public add(repository: string): Promise<ICommandResultWithData<IModuleRepositoryItem | undefined>> {
        return command<IModuleRepositoryItem | undefined>('install', repository, async (result) => {
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

            const existingModule = this.getAll().find(x => x.repository === repository);
            if (existingModule) {
                throw new Error('Module already exists');
            }

            const parts = repository.split('/');
            const folderName = parts[parts.length - 1];

            // check destination folder 
            const fullModulePath = path.join(this.modulesRootPath, folderName);
            if (!this.isDirEmpty(fullModulePath)) {
                throw new Error('Destination folder already exists');
            }

            const resultGitClone = await SystemCommand.run('git clone ' + repository + ' ' + folderName, this.modulesRootPath);
            result.children.push(resultGitClone);

            let moduleDefinition: IModuleRepositoryItem | undefined;

            if (resultGitClone.success) {
                moduleDefinition = await this.moduleLoader.loadModule(folderName);
                if (moduleDefinition) {
                    this.moduleRepository.add(moduleDefinition);
                }
            }

            return moduleDefinition;
        });
    }

    public update(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
        return command('update', moduleDefinition.name, async () => {
            if (!moduleDefinition) {
                throw new Error('Can not update module');
            }

            return await SystemCommand.run('git fetch --all && git reset --hard origin/master', moduleDefinition.path);
        });
    }

    public install(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
        return command('install', moduleDefinition.name, async () => {
            if (!moduleDefinition || !moduleDefinition.canInstall) {
                throw new Error('Can not install module');
            }

            const result = await SystemCommand.run('npm install', moduleDefinition.path);
            moduleDefinition.isInstalled = moduleDefinition.isInstalled || result.success;
            return result;
        });
    }

    public build(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
        return command('build', moduleDefinition.name, async () => {
            if (!moduleDefinition || !moduleDefinition.canBuild) {
                throw new Error('Can not build module');
            }

            const result = await SystemCommand.run('npm run build', moduleDefinition.path);
            moduleDefinition.isBuilded = moduleDefinition.isBuilded || result.success;
            return result;
        });
    }

    public remove(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
        return command('remove', moduleDefinition.name, () => {
            if (!moduleDefinition || !moduleDefinition.canRemove) {
                throw new Error('Can not remove module');
            }

            this.moduleRepository.remove(moduleDefinition.name);
            return SystemCommand.run('rimraf ' + moduleDefinition.path, this.modulesRootPath);
        });
    }

    public checkUpdates(): Promise<ICommandResultWithData<string[]>> {
        return command<string[]>('checkUpdates', undefined, async (result) => {
            const modulesWithUpdate: string[] = [];
            const modules = this.moduleRepository.getAll();
            for (const item of modules) {
                const resultHasUpdate = await this.hasUpdate(item);
                result.children.push(resultHasUpdate);

                if (resultHasUpdate.success) {
                    item.hasUpdate = resultHasUpdate.data;
                    if (item.hasUpdate) {
                        modulesWithUpdate.push(item.name);
                    }
                }
            }

            return modulesWithUpdate;
        });
    }

    public hasUpdate(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResultWithData<boolean>> {
        return command<boolean>('checkUpdate', moduleDefinition.name, async (result) => {
            const result1 = await SystemCommand.run('git remote -v update', moduleDefinition.path);
            result.children.push(result1);
            if (result1.success === false) {
                return false;
            }

            const result2 = await SystemCommand.run('git rev-list HEAD...origin/master --count', moduleDefinition.path);
            result.children.push(result2);
            if (result2.success === false) {
                return false;
            }

            return result2.log[0] !== '0';
        });
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