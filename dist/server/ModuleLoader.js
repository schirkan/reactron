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
class ModuleLoader {
    constructor(config) {
        this.config = config;
        this.modulesPath = path.join(this.config.root, 'modules');
    }
    static cleanRepositoryUrl(repository) {
        repository = (repository || '').trim();
        // remove / from end
        if (repository.endsWith('/')) {
            repository = repository.substr(0, repository.length - 1);
        }
        // remove .git from end
        if (repository.endsWith('.git')) {
            repository = repository.substr(0, repository.length - 4);
        }
        return repository;
    }
    loadAllModules() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            const items = fs.readdirSync(this.modulesPath);
            for (const item of items) {
                const moduleFolderFull = path.join(this.modulesPath, item);
                if (fs.statSync(moduleFolderFull).isDirectory()) {
                    const newModule = yield this.loadModule(item);
                    if (newModule) {
                        result.push(newModule);
                    }
                }
            }
            return result;
        });
    }
    loadModule(folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageFile = path.join(this.modulesPath, folderName, 'package.json');
            let p;
            try {
                const fileContent = fs.readFileSync(packageFile, { encoding: 'utf-8' });
                p = JSON.parse(fileContent);
                console.log('reading ' + packageFile);
            }
            catch (error) {
                console.log('Error reading package.json', error);
                return;
            }
            const moduleDefinition = {
                displayName: p.displayName || p.name,
                path: path.join(this.modulesPath, folderName),
                name: p.name,
                description: p.description,
                version: p.version,
                author: p.author,
                repository: p.repository && p.repository.url || p.repository,
                isBuilded: true
            };
            // clean repository url
            moduleDefinition.repository = ModuleLoader.cleanRepositoryUrl(moduleDefinition.repository);
            if (p.browser) {
                moduleDefinition.browserFile = path.join('modules', folderName, p.browser);
                if (!fs.existsSync(path.join(this.config.root, moduleDefinition.browserFile))) {
                    moduleDefinition.isBuilded = false;
                }
            }
            if (p.main) {
                moduleDefinition.serverFile = path.join(this.config.root, 'modules', folderName, p.main);
                if (!fs.existsSync(moduleDefinition.serverFile)) {
                    moduleDefinition.isBuilded = false;
                }
            }
            if (!moduleDefinition.browserFile && !moduleDefinition.serverFile) {
                console.log('No module in folder ' + folderName);
                return;
            }
            moduleDefinition.canBuild = p.scripts && !!p.scripts.build;
            moduleDefinition.canInstall = !!((p.dependencies && Object.keys(p.dependencies).length) ||
                (p.devDependencies && Object.keys(p.devDependencies).length));
            moduleDefinition.canRemove = true;
            moduleDefinition.isInstalled = fs.existsSync(path.join(this.config.root, 'modules', folderName, 'node_modules'));
            console.log('Module loaded: ' + moduleDefinition.name);
            return moduleDefinition;
        });
    }
    ;
}
exports.ModuleLoader = ModuleLoader;
//# sourceMappingURL=ModuleLoader.js.map