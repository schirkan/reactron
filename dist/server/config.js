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
const isPortAvailable_1 = require("./lib/isPortAvailable");
const path = require("path");
const fs = require("fs");
const findNodeModules = (root) => {
    const folder = path.join(root, 'node_modules');
    if (fs.existsSync(folder)) {
        return folder;
    }
    const newRoot = path.join(root, '..');
    if (newRoot === root) {
        return undefined;
    }
    return findNodeModules(newRoot);
};
exports.createConfig = (root) => __awaiter(this, void 0, void 0, function* () {
    const isDev = process.env.NODE_ENV === 'development';
    const port80available = yield isPortAvailable_1.isPortAvailable(80);
    const defaultPort = port80available ? 80 : 3000;
    const reactronIsNpmModule = root.includes('node_modules');
    const nodeModulesFolder = findNodeModules(root);
    if (nodeModulesFolder === undefined) {
        throw new Error('nodeModulesFolder is undefined');
    }
    return {
        root,
        modulesRootPath: reactronIsNpmModule ? path.join(nodeModulesFolder, '..') : path.join(root, 'modules'),
        nodeModulesPath: nodeModulesFolder,
        isDev,
        frontendPort: defaultPort,
        backendPort: isDev ? 5000 : defaultPort,
        defaultSystemSettings: {
            lang: 'en',
            location: '',
            timezone: 'Europe/Berlin',
            startupPath: '/',
            autorefresh: []
        },
        defaultWebPageOptions: [{
                id: 'homepage',
                title: 'Home',
                path: '/',
                webComponentId: 'welcome',
                style: {
                    backgroundColor: '#000',
                    color: '#fff'
                }
            }],
        defaultWebComponentOptions: [{
                id: 'welcome',
                parentId: 'homepage',
                componentName: 'Welcome',
                moduleName: 'reactron'
            }]
    };
});
//# sourceMappingURL=config.js.map