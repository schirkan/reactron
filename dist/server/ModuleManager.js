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
var SystemCommand_1 = require("./SystemCommand");
var ModuleManager = /** @class */ (function () {
    function ModuleManager(config, moduleRepository, moduleLoader) {
        this.config = config;
        this.moduleRepository = moduleRepository;
        this.moduleLoader = moduleLoader;
        this.modulesRootPath = path.join(this.config.root, 'modules');
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
    ModuleManager.prototype.getAll = function () {
        return this.moduleRepository.getAll();
    };
    ModuleManager.prototype.get = function (moduleName) {
        return this.moduleRepository.get(moduleName);
    };
    ModuleManager.prototype.add = function (repository) {
        var _this = this;
        return commandResultWrapper_1.command('add', repository, function (result) { return __awaiter(_this, void 0, void 0, function () {
            var existingModule, parts, folderName, fullModulePath, resultGitClone, moduleDefinition;
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
                        existingModule = this.getAll().find(function (x) { return x.repository === repository; });
                        if (existingModule) {
                            throw new Error('Module already exists :' + repository);
                        }
                        parts = repository.split('/');
                        folderName = parts[parts.length - 1];
                        fullModulePath = path.join(this.modulesRootPath, folderName);
                        if (!this.isDirEmpty(fullModulePath)) {
                            throw new Error('Destination folder already exists');
                        }
                        return [4 /*yield*/, SystemCommand_1.SystemCommand.run('git clone ' + repository + ' ' + folderName, this.modulesRootPath)];
                    case 1:
                        resultGitClone = _a.sent();
                        result.children.push(resultGitClone);
                        if (!resultGitClone.success) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.moduleLoader.loadModule(folderName)];
                    case 2:
                        moduleDefinition = _a.sent();
                        if (moduleDefinition) {
                            this.moduleRepository.add(moduleDefinition);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, moduleDefinition];
                }
            });
        }); });
    };
    ModuleManager.prototype.update = function (moduleDefinition) {
        var _this = this;
        return commandResultWrapper_1.command('update', moduleDefinition.name, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!moduleDefinition) {
                            throw new Error('Can not update module');
                        }
                        return [4 /*yield*/, SystemCommand_1.SystemCommand.run('git fetch --all && git reset --hard origin/master', moduleDefinition.path)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); });
    };
    ModuleManager.prototype.install = function (moduleDefinition) {
        var _this = this;
        return commandResultWrapper_1.command('install', moduleDefinition.name, function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!moduleDefinition || !moduleDefinition.canInstall) {
                            throw new Error('Can not install module');
                        }
                        return [4 /*yield*/, SystemCommand_1.SystemCommand.run('npm install', moduleDefinition.path)];
                    case 1:
                        result = _a.sent();
                        moduleDefinition.isInstalled = moduleDefinition.isInstalled || result.success;
                        return [2 /*return*/, result];
                }
            });
        }); });
    };
    ModuleManager.prototype.build = function (moduleDefinition) {
        var _this = this;
        return commandResultWrapper_1.command('build', moduleDefinition.name, function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!moduleDefinition || !moduleDefinition.canBuild) {
                            throw new Error('Can not build module');
                        }
                        return [4 /*yield*/, SystemCommand_1.SystemCommand.run('npm run build', moduleDefinition.path)];
                    case 1:
                        result = _a.sent();
                        moduleDefinition.isBuilded = moduleDefinition.isBuilded || result.success;
                        return [2 /*return*/, result];
                }
            });
        }); });
    };
    ModuleManager.prototype.remove = function (moduleDefinition) {
        var _this = this;
        return commandResultWrapper_1.command('remove', moduleDefinition.name, function () {
            if (!moduleDefinition || !moduleDefinition.canRemove) {
                throw new Error('Can not remove module');
            }
            _this.moduleRepository.remove(moduleDefinition.name);
            return SystemCommand_1.SystemCommand.run('rimraf ' + moduleDefinition.path, _this.modulesRootPath);
        });
    };
    ModuleManager.prototype.checkUpdates = function () {
        var _this = this;
        return commandResultWrapper_1.command('checkUpdates', undefined, function (result) { return __awaiter(_this, void 0, void 0, function () {
            var modulesWithUpdate, modules, _i, modules_1, item, resultHasUpdate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modulesWithUpdate = [];
                        modules = this.moduleRepository.getAll();
                        _i = 0, modules_1 = modules;
                        _a.label = 1;
                    case 1:
                        if (!(_i < modules_1.length)) return [3 /*break*/, 4];
                        item = modules_1[_i];
                        return [4 /*yield*/, this.hasUpdate(item)];
                    case 2:
                        resultHasUpdate = _a.sent();
                        result.children.push(resultHasUpdate);
                        if (resultHasUpdate.success) {
                            item.hasUpdate = resultHasUpdate.data;
                            if (item.hasUpdate) {
                                modulesWithUpdate.push(item.name);
                            }
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, modulesWithUpdate];
                }
            });
        }); });
    };
    ModuleManager.prototype.hasUpdate = function (moduleDefinition) {
        var _this = this;
        return commandResultWrapper_1.command('checkUpdate', moduleDefinition.name, function (result) { return __awaiter(_this, void 0, void 0, function () {
            var result1, result2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SystemCommand_1.SystemCommand.run('git remote -v update', moduleDefinition.path)];
                    case 1:
                        result1 = _a.sent();
                        result.children.push(result1);
                        if (result1.success === false) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, SystemCommand_1.SystemCommand.run('git rev-list HEAD...origin/master --count', moduleDefinition.path)];
                    case 2:
                        result2 = _a.sent();
                        result.children.push(result2);
                        if (result2.success === false) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, result2.log[0] !== '0'];
                }
            });
        }); });
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
    return ModuleManager;
}());
exports.ModuleManager = ModuleManager;
//# sourceMappingURL=ModuleManager.js.map