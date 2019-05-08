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
const commandResultWrapper_1 = require("../commandResultWrapper");
const SystemCommand_1 = require("../SystemCommand");
const ModuleHelper_1 = require("./ModuleHelper");
class NpmModuleHandler {
    constructor(config, moduleRepository) {
        this.config = config;
        this.moduleRepository = moduleRepository;
        this.modulesPath = path.join(this.config.modulesRootPath, 'node_modules');
        this.modulesPackageFile = path.join(this.config.modulesRootPath, 'package.json');
        if (!fs.existsSync(this.modulesPackageFile)) {
            this.createModulePackageJson();
        }
        SystemCommand_1.SystemCommand.run('npm config set loglevel warn', this.config.modulesRootPath);
    }
    createModulePackageJson() {
        const content = `{
  "name": "@schirkan/reactron-modules",
  "version": "1.0.0",
  "license": "MIT",
  "repository": {
      "type": "git",
      "url": "https://github.com/schirkan/reactron"
  },
  "dependencies": {
  }
}`;
        fs.writeFileSync(this.modulesPackageFile, content);
    }
    loadAllModules() {
        const result = [];
        const moduleNames = this.loadModuleNames();
        console.log('found ' + moduleNames.length + ' modules');
        for (const moduleName of moduleNames) {
            const moduleFolderFull = path.join(this.modulesPath, moduleName);
            if (fs.statSync(moduleFolderFull).isDirectory()) {
                const newModule = this.loadModule(moduleName);
                if (newModule) {
                    result.push(newModule);
                }
            }
        }
        console.log('NpmModuleHandler: ' + result.length + ' modules loaded');
        return result;
    }
    loadModuleNames() {
        const p = ModuleHelper_1.loadPackageJson(this.modulesPackageFile);
        return Object.keys(p && p.dependencies || {});
    }
    loadModule(folderName) {
        const modulePath = path.join(this.modulesPath, folderName);
        const newModule = ModuleHelper_1.loadModule(modulePath);
        const moduleDefinition = newModule && newModule.definition;
        if (moduleDefinition) {
            const requestedType = newModule && newModule.package && newModule.package._requested && newModule.package._requested.type;
            moduleDefinition.type = requestedType === 'git' ? 'npm+git' : 'npm';
        }
        return moduleDefinition;
    }
    updateAllModules() {
        return commandResultWrapper_1.command('updateAll', undefined, (result) => __awaiter(this, void 0, void 0, function* () {
            const result1 = yield SystemCommand_1.SystemCommand.run('npm update', this.config.modulesRootPath);
            result.children.push(result1);
            const result2 = yield SystemCommand_1.SystemCommand.run('npm audit fix', this.config.modulesRootPath);
            result.children.push(result2);
        }));
    }
    add(repository) {
        return commandResultWrapper_1.command('add', repository, (result) => __awaiter(this, void 0, void 0, function* () {
            // clean repository url
            repository = ModuleHelper_1.cleanRepositoryUrl(repository);
            if (!repository) {
                throw new Error('Invalid repository');
            }
            const existingModule = this.moduleRepository.getAll().find(x => x.repository === repository);
            if (existingModule) {
                throw new Error('Module already exists: ' + existingModule.name);
            }
            const npmInstallResult = yield SystemCommand_1.SystemCommand.run('npm i --save ' + repository, this.config.modulesRootPath);
            result.children.push(npmInstallResult);
            let moduleDefinition;
            if (npmInstallResult.success) {
                // find newly added module
                const moduleNames = this.loadModuleNames();
                const registeredModuleNames = this.moduleRepository.getAll().map(x => x.name);
                const newModuleNames = moduleNames.filter(x => !registeredModuleNames.includes(x));
                if (newModuleNames.length === 1) {
                    moduleDefinition = this.loadModule(newModuleNames[0]); // TODO: namespace?
                    if (moduleDefinition) {
                        this.moduleRepository.add(moduleDefinition);
                    }
                }
            }
            return moduleDefinition;
        }));
    }
    update(moduleDefinition) {
        return commandResultWrapper_1.command('update', moduleDefinition && moduleDefinition.name, () => __awaiter(this, void 0, void 0, function* () {
            if (!this.canHandleModule(moduleDefinition)) {
                throw new Error('Can not update module');
            }
            let updateResult;
            if (moduleDefinition.type === 'npm') {
                updateResult = yield SystemCommand_1.SystemCommand.run('npm install --save ' + moduleDefinition.name + '@' + moduleDefinition.updateVersion, this.config.modulesRootPath);
            }
            else {
                updateResult = yield SystemCommand_1.SystemCommand.run('npm update ' + moduleDefinition.name, this.config.modulesRootPath);
            }
            if (updateResult.success) {
                moduleDefinition.hasUpdate = false;
                ModuleHelper_1.refreshModule(moduleDefinition);
            }
            return updateResult;
        }));
    }
    remove(moduleDefinition) {
        return commandResultWrapper_1.command('remove', moduleDefinition && moduleDefinition.name, () => __awaiter(this, void 0, void 0, function* () {
            if (!this.canHandleModule(moduleDefinition)) {
                throw new Error('Can not remove module');
            }
            const result = yield SystemCommand_1.SystemCommand.run('npm un ' + moduleDefinition.name, this.config.modulesRootPath);
            if (result.success) {
                this.moduleRepository.remove(moduleDefinition.name);
            }
            return result;
        }));
    }
    canHandleModule(moduleDefinition) {
        return !!moduleDefinition && !!moduleDefinition.name &&
            (moduleDefinition.type === 'npm' || moduleDefinition.type === 'npm+git');
    }
    canAdd(repository) {
        return Promise.resolve(!!repository);
    }
    canRemove(moduleDefinition) {
        return Promise.resolve(this.canHandleModule(moduleDefinition));
    }
    canUpdate(moduleDefinition) {
        return Promise.resolve(this.canHandleModule(moduleDefinition));
    }
    hasUpdate(moduleDefinition) {
        return commandResultWrapper_1.command('checkUpdate', moduleDefinition && moduleDefinition.name, (result) => __awaiter(this, void 0, void 0, function* () {
            if (!this.canHandleModule(moduleDefinition)) {
                return false;
            }
            if (moduleDefinition.type === 'npm') {
                const npmViewVersionResult = yield SystemCommand_1.SystemCommand.run('npm view ' + moduleDefinition.name + ' version', this.config.modulesRootPath);
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
            else if (moduleDefinition.type === 'npm+git') {
                const packagePath = path.join(moduleDefinition.path, 'package.json');
                const packageJson = ModuleHelper_1.loadPackageJson(packagePath);
                let localHash = packageJson && packageJson._resolved && packageJson._resolved;
                if (localHash && localHash.length > 40) {
                    localHash = localHash.substr(localHash.length - 40); // get SHA-1 from git url
                    const gitRemoteResult = yield SystemCommand_1.SystemCommand.run('git ls-remote ' + moduleDefinition.repository, this.config.modulesRootPath);
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
        }));
    }
}
exports.NpmModuleHandler = NpmModuleHandler;
//# sourceMappingURL=NpmModuleHandler.js.map