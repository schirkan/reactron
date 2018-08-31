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
var commandResultWrapper_1 = require("./commandResultWrapper");
var ModuleLoader_1 = require("./ModuleLoader");
var SystemCommand_1 = require("./SystemCommand");
var ModuleManager = /** @class */ (function () {
    function ModuleManager(config, moduleRepository, serviceManager) {
        this.config = config;
        this.moduleRepository = moduleRepository;
        this.serviceManager = serviceManager;
        this.moduleLoader = new ModuleLoader_1.ModuleLoader(this.config);
        this.modulesRootPath = path.join(this.config.root, 'modules');
        this.add = commandResultWrapper_1.wrapCall(this.add);
        this.build = commandResultWrapper_1.wrapCall(this.build);
        this.update = commandResultWrapper_1.wrapCall(this.update);
        this.remove = commandResultWrapper_1.wrapCall(this.remove);
        this.install = commandResultWrapper_1.wrapCall(this.install);
    }
    ModuleManager.prototype.loadAllModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modules;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.moduleLoader.loadAllModules()];
                    case 1:
                        modules = _a.sent();
                        modules.forEach(this.moduleRepository.add);
                        return [2 /*return*/];
                }
            });
        });
    };
    ModuleManager.prototype.getModuleDefinitions = function () {
        return this.moduleRepository.getAll();
    };
    ModuleManager.prototype.getModuleDefinition = function (moduleName) {
        return this.moduleRepository.get(moduleName);
    };
    ModuleManager.prototype.add = function (repository) {
        return __awaiter(this, void 0, void 0, function () {
            var parts, folderName, fullModulePath, result, moduleDefinition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        parts = repository.split('/');
                        folderName = parts[parts.length - 1];
                        fullModulePath = path.join(this.modulesRootPath, folderName);
                        if (!this.isDirEmpty(fullModulePath)) {
                            throw new Error('Destination folder already exists');
                        }
                        return [4 /*yield*/, SystemCommand_1.SystemCommand.run('git clone ' + repository + ' ' + folderName, this.modulesRootPath)];
                    case 1:
                        result = _a.sent();
                        if (!result.success) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.moduleLoader.loadModule(folderName)];
                    case 2:
                        moduleDefinition = _a.sent();
                        if (moduleDefinition) {
                            moduleDefinition.commandLog.push(result);
                            this.moduleRepository.add(moduleDefinition);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, result];
                }
            });
        });
    };
    ModuleManager.prototype.update = function (moduleName) {
        return __awaiter(this, void 0, void 0, function () {
            var modulePath, result, moduleDefinition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modulePath = this.getModulePath(moduleName);
                        return [4 /*yield*/, SystemCommand_1.SystemCommand.run('git pull -n', modulePath)];
                    case 1:
                        result = _a.sent();
                        moduleDefinition = this.getModuleDefinition(moduleName);
                        if (moduleDefinition) {
                            moduleDefinition.commandLog.push(result);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    ModuleManager.prototype.install = function (moduleName) {
        return __awaiter(this, void 0, void 0, function () {
            var modulePath, result, moduleDefinition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modulePath = this.getModulePath(moduleName);
                        return [4 /*yield*/, SystemCommand_1.SystemCommand.run('npm install', modulePath)];
                    case 1:
                        result = _a.sent();
                        moduleDefinition = this.getModuleDefinition(moduleName);
                        if (moduleDefinition) {
                            moduleDefinition.isInstalled = moduleDefinition.isInstalled && result.success;
                            moduleDefinition.commandLog.push(result);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    ModuleManager.prototype.build = function (moduleName) {
        return __awaiter(this, void 0, void 0, function () {
            var modulePath, result, moduleDefinition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modulePath = this.getModulePath(moduleName);
                        return [4 /*yield*/, SystemCommand_1.SystemCommand.run('npm run build', modulePath)];
                    case 1:
                        result = _a.sent();
                        moduleDefinition = this.getModuleDefinition(moduleName);
                        if (moduleDefinition) {
                            moduleDefinition.isBuilded = moduleDefinition.isBuilded && result.success;
                            moduleDefinition.commandLog.push(result);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    ModuleManager.prototype.remove = function (moduleName) {
        var modulePath = this.getModulePath(moduleName);
        this.moduleRepository.remove(moduleName);
        return SystemCommand_1.SystemCommand.run('rimraf ' + modulePath, this.modulesRootPath);
    };
    ModuleManager.prototype.isDirEmpty = function (dirname) {
        try {
            var files = fs.readdirSync(dirname);
            return !files.length;
        }
        catch (error) {
            return true;
        }
    };
    ModuleManager.prototype.getModulePath = function (moduleName) {
        var moduleDefinition = this.getModuleDefinition(moduleName);
        if (!moduleDefinition) {
            throw Error("Module '" + moduleName + "' not found.");
        }
        return path.join(this.modulesRootPath, moduleDefinition.folder);
    };
    return ModuleManager;
}());
exports.ModuleManager = ModuleManager;
//# sourceMappingURL=ModuleManager.js.map