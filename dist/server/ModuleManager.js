"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const commandResultWrapper_1 = require("./commandResultWrapper");
const ModuleLoader_1 = require("./ModuleLoader");
const SystemCommand_1 = require("./SystemCommand");
class ModuleManager {
    constructor(config, moduleRepository) {
        this.config = config;
        this.moduleRepository = moduleRepository;
        this.moduleLoader = new ModuleLoader_1.ModuleLoader(this.config);
        this.modulesRootPath = path.join(this.config.root, 'modules');
    }
    loadAllModules() {
        const modules = this.moduleLoader.loadAllModules();
        modules.forEach(this.moduleRepository.add);
        SystemCommand_1.SystemCommand.run('npm config set loglevel warn', this.modulesRootPath);
    }
    getAll() {
        return this.moduleRepository.getAll();
    }
    get(moduleName) {
        return this.moduleRepository.get(moduleName);
    }
    add(repository) {
        return commandResultWrapper_1.command('add', repository, (result) => __awaiter(this, void 0, void 0, function* () {
            // clean repository url
            repository = ModuleLoader_1.ModuleLoader.cleanRepositoryUrl(repository);
            if (!repository) {
                throw new Error('Invalid repository');
            }
            const existingModule = this.getAll().find(x => x.repository === repository);
            if (existingModule) {
                throw new Error('Module already exists :' + repository);
            }
            const npmInstallResult = yield SystemCommand_1.SystemCommand.run('npm i --save ' + repository, this.modulesRootPath);
            result.children.push(npmInstallResult);
            let moduleDefinition;
            if (npmInstallResult.success) {
                // find newly added module
                const moduleNames = this.moduleLoader.loadModuleNames();
                const registeredModuleNames = this.moduleRepository.getAll().map(x => x.name);
                const newModuleNames = moduleNames.filter(x => !registeredModuleNames.includes(x));
                if (newModuleNames.length === 1) {
                    moduleDefinition = this.moduleLoader.loadModule(newModuleNames[0]);
                    if (moduleDefinition) {
                        this.moduleRepository.add(moduleDefinition);
                    }
                }
            }
            // const parts = repository.split('/');
            // const folderName = parts[parts.length - 1];
            // // check destination folder 
            // const fullModulePath = path.join(this.modulesRootPath, folderName);
            // if (!this.isDirEmpty(fullModulePath)) {
            //   throw new Error('Destination folder already exists');
            // }
            // const resultGitClone = await SystemCommand.run('git clone ' + repository + ' ' + folderName, this.modulesRootPath);
            // result.children.push(resultGitClone);
            // let moduleDefinition: IModuleRepositoryItem | undefined;
            // if (resultGitClone.success) {
            //   moduleDefinition = await this.moduleLoader.loadModule(folderName);
            //   if (moduleDefinition) {
            //     this.moduleRepository.add(moduleDefinition);
            //   }
            // }
            return moduleDefinition;
        }));
    }
    updateAll() {
        return commandResultWrapper_1.command('updateAll', undefined, (result) => __awaiter(this, void 0, void 0, function* () {
            const result1 = yield SystemCommand_1.SystemCommand.run('npm update', this.modulesRootPath);
            result.children.push(result1);
            const result2 = yield SystemCommand_1.SystemCommand.run('npm audit fix', this.modulesRootPath);
            result.children.push(result2);
            const result3 = yield commandResultWrapper_1.command('refreshModules', undefined, () => __awaiter(this, void 0, void 0, function* () {
                this.moduleRepository.getAll().forEach(m => this.moduleLoader.refreshModule(m));
            }));
            result.children.push(result3);
        }));
        // const moduleRepositoryItems = BackendService.instance.moduleManager.getAll().filter(x => x.hasUpdate);
        // const results: ICommandResult[] = [];
        // for (const moduleRepositoryItem of moduleRepositoryItems) {
        //   const resultUpdate = await BackendService.instance.moduleManager.update(moduleRepositoryItem);
        //   results.push(resultUpdate);
        // }
        // return [];
    }
    update(moduleDefinition) {
        return commandResultWrapper_1.command('update', moduleDefinition && moduleDefinition.name, () => __awaiter(this, void 0, void 0, function* () {
            if (!moduleDefinition) {
                throw new Error('Can not update module');
            }
            let updateResult;
            if (moduleDefinition.type === 'npm') {
                updateResult = yield SystemCommand_1.SystemCommand.run('npm install --save ' + moduleDefinition.name + '@' + moduleDefinition.updateVersion, this.modulesRootPath);
            }
            else {
                updateResult = yield SystemCommand_1.SystemCommand.run('npm update ' + moduleDefinition.name, this.modulesRootPath);
            }
            if (updateResult.success) {
                moduleDefinition.hasUpdate = false;
                this.moduleLoader.refreshModule(moduleDefinition);
            }
            return updateResult;
            // return await SystemCommand.run('git fetch --all && git reset --hard origin/master', moduleDefinition.path);
        }));
    }
    // public install(moduleDefinition: IModuleRepositoryItem, propdOnly: boolean): Promise<ICommandResult> {
    //   return command('install', moduleDefinition && moduleDefinition.name, async () => {
    //     if (!moduleDefinition || !moduleDefinition.canInstall) {
    //       throw new Error('Can not install module');
    //     }
    //     const commandArgs = propdOnly ? ' --production' : '';
    //     const result = await SystemCommand.run('npm install' + commandArgs, moduleDefinition.path);
    //     moduleDefinition.isInstalled = moduleDefinition.isInstalled || result.success;
    //     return result;
    //   });
    // }
    // public build(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult> {
    //   return command('build', moduleDefinition && moduleDefinition.name, async () => {
    //     if (!moduleDefinition || !moduleDefinition.canBuild) {
    //       throw new Error('Can not build module');
    //     }
    //     const result = await SystemCommand.run('npm run build', moduleDefinition.path);
    //     moduleDefinition.isBuilded = moduleDefinition.isBuilded || result.success;
    //     return result;
    //   });
    // }
    remove(moduleDefinition) {
        return commandResultWrapper_1.command('remove', moduleDefinition && moduleDefinition.name, () => __awaiter(this, void 0, void 0, function* () {
            if (!moduleDefinition || !moduleDefinition.canRemove) {
                throw new Error('Can not remove module');
            }
            const result = yield SystemCommand_1.SystemCommand.run('npm un ' + moduleDefinition.name, this.modulesRootPath);
            if (result.success) {
                this.moduleRepository.remove(moduleDefinition.name);
            }
            return result;
            // this.moduleRepository.remove(moduleDefinition.name);
            // return SystemCommand.run('rimraf ' + moduleDefinition.path, this.modulesRootPath);
        }));
    }
    checkUpdates() {
        return commandResultWrapper_1.command('checkUpdates', undefined, (result) => __awaiter(this, void 0, void 0, function* () {
            const modulesWithUpdate = [];
            const modules = this.moduleRepository.getAll();
            for (const item of modules) {
                const resultHasUpdate = yield this.hasUpdate(item);
                result.children.push(resultHasUpdate);
                if (item.hasUpdate) {
                    modulesWithUpdate.push(item.name);
                }
            }
            return modulesWithUpdate;
        }));
    }
    hasUpdate(moduleDefinition) {
        return commandResultWrapper_1.command('checkUpdate', moduleDefinition && moduleDefinition.name, (result) => __awaiter(this, void 0, void 0, function* () {
            if (!moduleDefinition || !moduleDefinition.name) {
                throw new Error('Invalid module definition');
            }
            if (moduleDefinition.type === 'npm') {
                const npmViewVersionResult = yield SystemCommand_1.SystemCommand.run('npm view ' + moduleDefinition.name + ' version', this.modulesRootPath);
                result.children.push(npmViewVersionResult);
                if (npmViewVersionResult.success === false) {
                    return false;
                }
                moduleDefinition.updateVersion = npmViewVersionResult.log[0];
                moduleDefinition.hasUpdate = moduleDefinition.version !== moduleDefinition.updateVersion;
                if (moduleDefinition.hasUpdate) {
                    result.log.push('New version available: ' + moduleDefinition.updateVersion);
                }
                return moduleDefinition.hasUpdate;
            }
            else if (moduleDefinition.type === 'git') {
                const packagePath = path.join(moduleDefinition.path, 'package.json');
                const packageJson = ModuleLoader_1.ModuleLoader.loadPackageJson(packagePath);
                let localHash = packageJson && packageJson._resolved && packageJson._resolved;
                if (localHash && localHash.length > 40) {
                    localHash = localHash.substr(localHash.length - 40); // get SHA-1 from git url
                    const gitRemoteResult = yield SystemCommand_1.SystemCommand.run('git ls-remote ' + moduleDefinition.repository, this.modulesRootPath);
                    result.children.push(gitRemoteResult);
                    if (gitRemoteResult.success === false) {
                        return false;
                    }
                    const remoteHash = gitRemoteResult.log[0].substr(0, 40); // get SHA-1 for HEAD
                    moduleDefinition.hasUpdate = localHash !== remoteHash;
                    if (moduleDefinition.hasUpdate) {
                        result.log.push('New commit available: ' + remoteHash);
                    }
                    return moduleDefinition.hasUpdate;
                }
            }
            return false;
            // const result1 = await SystemCommand.run('git remote -v update', moduleDefinition.path);
            // result.children.push(result1);
            // if (result1.success === false) {
            //   return false;
            // }
            // const result2 = await SystemCommand.run('git rev-list HEAD...origin/master --count', moduleDefinition.path);
            // result.children.push(result2);
            // if (result2.success === false) {
            //   return false;
            // }
            // return result2.log[0] !== '0';
        }));
    }
}
exports.ModuleManager = ModuleManager;
//# sourceMappingURL=ModuleManager.js.map