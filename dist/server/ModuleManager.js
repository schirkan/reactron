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
const fs = require("fs");
const path = require("path");
const commandResultWrapper_1 = require("./commandResultWrapper");
const ModuleLoader_1 = require("./ModuleLoader");
const SystemCommand_1 = require("./SystemCommand");
class ModuleManager {
    constructor(config, moduleRepository, moduleLoader) {
        this.config = config;
        this.moduleRepository = moduleRepository;
        this.moduleLoader = moduleLoader;
        this.modulesRootPath = path.join(this.config.root, 'modules');
    }
    loadAllModules() {
        return __awaiter(this, void 0, void 0, function* () {
            const modules = yield this.moduleLoader.loadAllModules();
            modules.forEach(this.moduleRepository.add);
        });
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
            const parts = repository.split('/');
            const folderName = parts[parts.length - 1];
            // check destination folder 
            const fullModulePath = path.join(this.modulesRootPath, folderName);
            if (!this.isDirEmpty(fullModulePath)) {
                throw new Error('Destination folder already exists');
            }
            const resultGitClone = yield SystemCommand_1.SystemCommand.run('git clone ' + repository + ' ' + folderName, this.modulesRootPath);
            result.children.push(resultGitClone);
            let moduleDefinition;
            if (resultGitClone.success) {
                moduleDefinition = yield this.moduleLoader.loadModule(folderName);
                if (moduleDefinition) {
                    this.moduleRepository.add(moduleDefinition);
                }
            }
            return moduleDefinition;
        }));
    }
    update(moduleDefinition) {
        return commandResultWrapper_1.command('update', moduleDefinition.name, () => __awaiter(this, void 0, void 0, function* () {
            if (!moduleDefinition) {
                throw new Error('Can not update module');
            }
            return yield SystemCommand_1.SystemCommand.run('git fetch --all && git reset --hard origin/master', moduleDefinition.path);
        }));
    }
    install(moduleDefinition, propdOnly) {
        return commandResultWrapper_1.command('install', moduleDefinition.name, () => __awaiter(this, void 0, void 0, function* () {
            if (!moduleDefinition || !moduleDefinition.canInstall) {
                throw new Error('Can not install module');
            }
            const commandArgs = propdOnly ? ' --production' : '';
            const result = yield SystemCommand_1.SystemCommand.run('npm install' + commandArgs, moduleDefinition.path);
            moduleDefinition.isInstalled = moduleDefinition.isInstalled || result.success;
            return result;
        }));
    }
    build(moduleDefinition) {
        return commandResultWrapper_1.command('build', moduleDefinition.name, () => __awaiter(this, void 0, void 0, function* () {
            if (!moduleDefinition || !moduleDefinition.canBuild) {
                throw new Error('Can not build module');
            }
            const result = yield SystemCommand_1.SystemCommand.run('npm run build', moduleDefinition.path);
            moduleDefinition.isBuilded = moduleDefinition.isBuilded || result.success;
            return result;
        }));
    }
    remove(moduleDefinition) {
        return commandResultWrapper_1.command('remove', moduleDefinition.name, () => {
            if (!moduleDefinition || !moduleDefinition.canRemove) {
                throw new Error('Can not remove module');
            }
            this.moduleRepository.remove(moduleDefinition.name);
            return SystemCommand_1.SystemCommand.run('rimraf ' + moduleDefinition.path, this.modulesRootPath);
        });
    }
    checkUpdates() {
        return commandResultWrapper_1.command('checkUpdates', undefined, (result) => __awaiter(this, void 0, void 0, function* () {
            const modulesWithUpdate = [];
            const modules = this.moduleRepository.getAll();
            for (const item of modules) {
                const resultHasUpdate = yield this.hasUpdate(item);
                result.children.push(resultHasUpdate);
                if (resultHasUpdate.success) {
                    item.hasUpdate = resultHasUpdate.data;
                    if (item.hasUpdate) {
                        modulesWithUpdate.push(item.name);
                    }
                }
            }
            return modulesWithUpdate;
        }));
    }
    hasUpdate(moduleDefinition) {
        return commandResultWrapper_1.command('checkUpdate', moduleDefinition.name, (result) => __awaiter(this, void 0, void 0, function* () {
            const result1 = yield SystemCommand_1.SystemCommand.run('git remote -v update', moduleDefinition.path);
            result.children.push(result1);
            if (result1.success === false) {
                return false;
            }
            const result2 = yield SystemCommand_1.SystemCommand.run('git rev-list HEAD...origin/master --count', moduleDefinition.path);
            result.children.push(result2);
            if (result2.success === false) {
                return false;
            }
            return result2.log[0] !== '0';
        }));
    }
    isDirEmpty(dirname) {
        try {
            const files = fs.readdirSync(dirname);
            return !files.length;
        }
        catch (error) {
            return true;
        }
    }
}
exports.ModuleManager = ModuleManager;
//# sourceMappingURL=ModuleManager.js.map