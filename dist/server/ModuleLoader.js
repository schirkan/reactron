"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var SystemCommand_1 = require("./SystemCommand");
var ModuleLoader = /** @class */ (function () {
    function ModuleLoader(config) {
        this.config = config;
        this.modulesPath = path.join(this.config.root, 'modules');
    }
    ModuleLoader.prototype.loadAllModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, items, _i, items_1, item, moduleFolderFull, newModule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        items = fs.readdirSync(this.modulesPath);
                        _i = 0, items_1 = items;
                        _a.label = 1;
                    case 1:
                        if (!(_i < items_1.length)) return [3 /*break*/, 4];
                        item = items_1[_i];
                        moduleFolderFull = path.join(this.modulesPath, item);
                        if (!fs.statSync(moduleFolderFull).isDirectory()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.loadModule(item)];
                    case 2:
                        newModule = _a.sent();
                        if (newModule) {
                            result.push(newModule);
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    ModuleLoader.prototype.loadModule = function (folderName) {
        return __awaiter(this, void 0, void 0, function () {
            var packageFile, p, fileContent, moduleDefinition, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        packageFile = path.join(this.modulesPath, folderName, 'package.json');
                        try {
                            fileContent = fs.readFileSync(packageFile, { encoding: 'utf-8' });
                            p = JSON.parse(fileContent);
                            console.log('reading ' + packageFile);
                        }
                        catch (error) {
                            console.log('Error reading package.json', error);
                            return [2 /*return*/, null];
                        }
                        moduleDefinition = {
                            folder: folderName,
                            path: path.join(this.modulesPath, folderName),
                            name: p.name,
                            description: p.description,
                            version: p.version,
                            author: p.author,
                            repository: p.repository && p.repository.url || p.repository,
                            isBuilded: true
                        };
                        moduleDefinition.commandLog = [];
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
                            return [2 /*return*/, null];
                        }
                        moduleDefinition.canBuild = p.scripts && !!p.scripts.build;
                        moduleDefinition.canUpdate = !!moduleDefinition.repository;
                        moduleDefinition.canInstall = !!(p.dependencies || p.devDependencies);
                        moduleDefinition.canRemove = true;
                        moduleDefinition.isInstalled = fs.existsSync(path.join(this.config.root, 'modules', folderName, 'node_modules'));
                        _a = moduleDefinition;
                        return [4 /*yield*/, this.hasUpdates(moduleDefinition)];
                    case 1:
                        _a.hasUpdates = _b.sent();
                        console.log('Module loaded: ' + moduleDefinition.name);
                        return [2 /*return*/, moduleDefinition];
                }
            });
        });
    };
    ;
    ModuleLoader.prototype.hasUpdates = function (moduleDefinition) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!moduleDefinition || !moduleDefinition.canUpdate) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, SystemCommand_1.SystemCommand.run('git rev-list HEAD...origin/master --count', moduleDefinition.path)];
                    case 1:
                        result = _a.sent();
                        moduleDefinition.commandLog.push(result);
                        return [2 /*return*/, result.log[0] !== '0'];
                }
            });
        });
    };
    return ModuleLoader;
}());
exports.ModuleLoader = ModuleLoader;
//# sourceMappingURL=ModuleLoader.js.map