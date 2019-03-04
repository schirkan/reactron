"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class ModuleLoader {
    constructor(config) {
        this.config = config;
        this.modulesPath = path.join(this.config.root, 'modules', 'node_modules');
        this.modulesPackageFile = path.join(this.config.root, 'modules', 'package.json');
        if (!fs.existsSync(this.modulesPackageFile)) {
            this.createModulePackageJson();
        }
    }
    static cleanRepositoryUrl(repository) {
        repository = (repository || '').trim();
        // remove git+ from start
        if (repository.startsWith('git+http')) {
            repository = repository.substr(4);
        }
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
    static loadPackageJson(packageFile) {
        try {
            const fileContent = fs.readFileSync(packageFile, { encoding: 'utf-8' });
            const p = JSON.parse(fileContent);
            console.log('reading ' + packageFile);
            return p;
        }
        catch (error) {
            console.log('Error reading ' + packageFile, error);
            return undefined;
        }
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
        // const items = fs.readdirSync(this.modulesPath);
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
        return result;
    }
    loadModuleNames() {
        const p = ModuleLoader.loadPackageJson(this.modulesPackageFile);
        return Object.keys(p && p.dependencies || {});
    }
    refreshModule(moduleDefinition) {
        const packageFile = path.join(moduleDefinition.path, 'package.json');
        const p = ModuleLoader.loadPackageJson(packageFile);
        moduleDefinition.displayName = p.displayName || p.name,
            moduleDefinition.description = p.description;
        moduleDefinition.version = p.version;
        moduleDefinition.author = p.author;
    }
    loadModule(folderName) {
        const packageFile = path.join(this.modulesPath, folderName, 'package.json');
        const p = ModuleLoader.loadPackageJson(packageFile);
        const moduleDefinition = {
            name: p.name,
            displayName: p.displayName || p.name,
            path: path.join(this.modulesPath, folderName),
            description: p.description,
            version: p.version,
            author: p.author,
            repository: p.repository && p.repository.url || p.repository,
            canRemove: true
        };
        if (p._requested && p._requested.type === 'git') {
            moduleDefinition.type = 'git';
        }
        else if (p._requested && p._requested.name) {
            moduleDefinition.type = 'npm';
        }
        // TODO other sources
        // clean repository url
        moduleDefinition.repository = ModuleLoader.cleanRepositoryUrl(moduleDefinition.repository);
        if (p.browser) {
            moduleDefinition.browserFile = path.join('modules', folderName, p.browser);
            if (!fs.existsSync(path.join(this.config.root, moduleDefinition.browserFile))) {
                console.log('Missing browserFile for ' + moduleDefinition.name);
                moduleDefinition.browserFile = undefined;
            }
        }
        if (p.main) {
            moduleDefinition.serverFile = path.join(this.modulesPath, folderName, p.main);
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
}
exports.ModuleLoader = ModuleLoader;
//# sourceMappingURL=ModuleLoader.js.map