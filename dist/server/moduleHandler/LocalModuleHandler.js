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
const ModuleHelper_1 = require("../ModuleHelper");
class LocalModuleHandler {
    constructor(config, moduleRepository) {
        this.config = config;
        this.moduleRepository = moduleRepository;
        this.modulesRootPath = path.join(this.config.root, 'modules');
    }
    loadAllModules() {
        const result = [];
        const moduleNames = this.loadModuleNames();
        console.log('found ' + moduleNames.length + ' modules');
        for (const moduleName of moduleNames) {
            const moduleFolderFull = path.join(this.modulesRootPath, moduleName);
            if (fs.statSync(moduleFolderFull).isDirectory()) {
                const newModule = this.loadModule(moduleName);
                if (newModule) {
                    result.push(newModule);
                }
            }
        }
        return result;
    }
    loadModuleNames() {
        const items = fs.readdirSync(this.modulesRootPath);
        return items.filter(x => x !== 'node_modules' && !x.startsWith('.'));
    }
    loadModule(folderName) {
        const packageFile = path.join(this.modulesRootPath, folderName, 'package.json');
        if (!fs.existsSync(packageFile)) {
            return;
        }
        const p = ModuleHelper_1.loadPackageJson(packageFile);
        const moduleDefinition = {
            name: p.name,
            displayName: p.displayName || p.name,
            path: path.join(this.modulesRootPath, folderName),
            description: p.description,
            version: p.version,
            author: p.author,
            repository: p.repository && p.repository.url || p.repository,
            canRemove: true,
            type: 'local'
        };
        if (moduleDefinition.repository && moduleDefinition.repository.includes('github')) { // TODO
            moduleDefinition.type = 'git';
        }
        // clean repository url
        moduleDefinition.repository = ModuleHelper_1.cleanRepositoryUrl(moduleDefinition.repository);
        if (p.browser) {
            moduleDefinition.browserFile = path.join('modules', folderName, p.browser);
            if (!fs.existsSync(path.join(this.config.root, moduleDefinition.browserFile))) {
                console.log('Missing browserFile for ' + moduleDefinition.name);
                moduleDefinition.browserFile = undefined;
            }
        }
        if (p.main) {
            moduleDefinition.serverFile = path.join(this.modulesRootPath, folderName, p.main);
            if (!fs.existsSync(moduleDefinition.serverFile)) {
                console.log('Missing serverFile for ' + moduleDefinition.name);
                moduleDefinition.serverFile = undefined;
            }
        }
        if (!moduleDefinition.browserFile && !moduleDefinition.serverFile) {
            console.log('No module in folder ' + folderName);
            return;
        }
        console.log('Module loaded: ' + moduleDefinition.name);
        return moduleDefinition;
    }
    ;
    add(repository) {
        return commandResultWrapper_1.command('add', repository, (result) => __awaiter(this, void 0, void 0, function* () {
            // clean repository url
            repository = ModuleHelper_1.cleanRepositoryUrl(repository);
            if (!repository) {
                throw new Error('Invalid repository');
            }
            const parts = repository.split('/');
            if (parts.length < 2) {
                throw new Error('Invalid repository');
            }
            const folderName = parts[parts.length - 1];
            // check destination folder 
            const fullModulePath = path.join(this.modulesRootPath, folderName);
            if (!this.isDirEmpty(fullModulePath)) {
                throw new Error('Destination folder already exists');
            }
            const gitCloneResult = yield SystemCommand_1.SystemCommand.run('git clone ' + repository + ' ' + folderName, this.modulesRootPath);
            result.children.push(gitCloneResult);
            let moduleDefinition;
            if (gitCloneResult.success) {
                moduleDefinition = yield this.loadModule(folderName);
                if (moduleDefinition) {
                    const installResult = yield SystemCommand_1.SystemCommand.run('npm install --production', moduleDefinition.path);
                    result.children.push(installResult);
                    this.moduleRepository.add(moduleDefinition);
                }
            }
            return moduleDefinition;
        }));
    }
    update(moduleDefinition) {
        return commandResultWrapper_1.command('update', moduleDefinition && moduleDefinition.name, (result) => __awaiter(this, void 0, void 0, function* () {
            if (!this.canHandleModule(moduleDefinition) || moduleDefinition.type !== 'git') {
                throw new Error('Can not update module');
            }
            const updateResult = yield SystemCommand_1.SystemCommand.run('git fetch --all && git reset --hard origin/master', moduleDefinition.path);
            result.children.push(updateResult);
            if (updateResult.success) {
                moduleDefinition.hasUpdate = false;
                ModuleHelper_1.refreshModule(moduleDefinition);
                const installResult = yield SystemCommand_1.SystemCommand.run('npm install --production', moduleDefinition.path);
                result.children.push(installResult);
            }
        }));
    }
    remove(moduleDefinition) {
        return commandResultWrapper_1.command('remove', moduleDefinition && moduleDefinition.name, () => __awaiter(this, void 0, void 0, function* () {
            if (!this.canHandleModule(moduleDefinition)) {
                throw new Error('Can not remove module');
            }
            const result = yield SystemCommand_1.SystemCommand.run('rimraf ' + moduleDefinition.path, this.modulesRootPath);
            if (result.success) {
                this.moduleRepository.remove(moduleDefinition.name);
            }
            return result;
        }));
    }
    canHandleModule(moduleDefinition) {
        return !!moduleDefinition && !!moduleDefinition.name &&
            (moduleDefinition.type === 'local' || moduleDefinition.type === 'git');
    }
    canAdd(repository) {
        return Promise.resolve(repository.startsWith('http://') && repository.includes('github'));
    }
    canRemove(moduleDefinition) {
        return Promise.resolve(this.canHandleModule(moduleDefinition));
    }
    canUpdate(moduleDefinition) {
        return Promise.resolve(this.canHandleModule(moduleDefinition) && moduleDefinition.type === 'git');
    }
    hasUpdate(moduleDefinition) {
        return commandResultWrapper_1.command('checkUpdate', moduleDefinition && moduleDefinition.name, (result) => __awaiter(this, void 0, void 0, function* () {
            if (!this.canHandleModule(moduleDefinition)) {
                return false;
            }
            if (moduleDefinition.type === 'local') {
                return false;
            }
            else if (moduleDefinition.type === 'git') {
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
            }
            return false;
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
exports.LocalModuleHandler = LocalModuleHandler;
//# sourceMappingURL=LocalModuleHandler.js.map