"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function cleanRepositoryUrl(repository) {
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
exports.cleanRepositoryUrl = cleanRepositoryUrl;
function loadPackageJson(packageFile) {
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
exports.loadPackageJson = loadPackageJson;
function refreshModule(moduleDefinition) {
    const packageFile = path.join(moduleDefinition.path, 'package.json');
    const p = loadPackageJson(packageFile);
    moduleDefinition.displayName = p.displayName || p.name,
        moduleDefinition.description = p.description;
    moduleDefinition.version = p.version;
    moduleDefinition.author = p.author;
}
exports.refreshModule = refreshModule;
function loadModule(modulePath) {
    const packageFile = path.join(modulePath, 'package.json');
    if (!fs.existsSync(packageFile)) {
        return;
    }
    const p = loadPackageJson(packageFile);
    const moduleDefinition = {
        name: p.name,
        displayName: p.displayName || p.name,
        path: modulePath,
        description: p.description,
        version: p.version,
        author: p.author,
        repository: p.repository && p.repository.url || p.repository,
        canRemove: true
    };
    // clean repository url
    moduleDefinition.repository = cleanRepositoryUrl(moduleDefinition.repository);
    if (p.browser) {
        const escapedModuleName = moduleDefinition.name.replace('/', '@');
        moduleDefinition.browserFile = path.join('modules', escapedModuleName, p.browser);
        if (!fs.existsSync(path.join(modulePath, p.browser))) {
            console.log('Missing browserFile for ' + moduleDefinition.name);
            moduleDefinition.browserFile = undefined;
        }
    }
    if (p.main) {
        moduleDefinition.serverFile = path.join(modulePath, p.main);
        if (!fs.existsSync(moduleDefinition.serverFile)) {
            console.log('Missing serverFile for ' + moduleDefinition.name);
            moduleDefinition.serverFile = undefined;
        }
    }
    if (!moduleDefinition.browserFile && !moduleDefinition.serverFile) {
        console.log('No module in folder ' + modulePath);
        return;
    }
    console.log('Module loaded: ' + moduleDefinition.name);
    return { definition: moduleDefinition, package: p };
}
exports.loadModule = loadModule;
;
//# sourceMappingURL=ModuleHelper.js.map