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
var apiRoutes_1 = require("../../common/apiRoutes");
var registerRoute_1 = require("./registerRoute");
var ModuleController = /** @class */ (function () {
    function ModuleController() {
    }
    ModuleController.prototype.start = function (helper) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log('ModuleController.start');
                registerRoute_1.registerRoute(helper.moduleApiRouter, apiRoutes_1.routes.getModules, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    var modules;
                    return __generator(this, function (_a) {
                        console.log('ModuleController.getAll');
                        modules = helper.backendService.moduleManager.getAll();
                        res.send(modules);
                        return [2 /*return*/];
                    });
                }); });
                registerRoute_1.registerRoute(helper.moduleApiRouter, apiRoutes_1.routes.getModule, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    var moduleRepositoryItem;
                    return __generator(this, function (_a) {
                        console.log('ModuleController.get');
                        moduleRepositoryItem = helper.backendService.moduleManager.get(req.params.moduleName);
                        if (moduleRepositoryItem) {
                            res.send(moduleRepositoryItem);
                        }
                        else {
                            res.sendStatus(404);
                        }
                        return [2 /*return*/];
                    });
                }); });
                registerRoute_1.registerRoute(helper.moduleApiRouter, apiRoutes_1.routes.addModule, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    var results, resultAdd, moduleRepositoryItem, resultInstall, resultBuild;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('ModuleController.add');
                                results = [];
                                return [4 /*yield*/, helper.backendService.moduleManager.add(req.body.repository)];
                            case 1:
                                resultAdd = _a.sent();
                                results.push(resultAdd);
                                if (!(resultAdd.success && resultAdd.data)) return [3 /*break*/, 4];
                                moduleRepositoryItem = resultAdd.data;
                                return [4 /*yield*/, helper.backendService.moduleManager.install(moduleRepositoryItem)];
                            case 2:
                                resultInstall = _a.sent();
                                results.push(resultInstall);
                                if (!!resultAdd.data.isBuilded) return [3 /*break*/, 4];
                                return [4 /*yield*/, helper.backendService.moduleManager.build(moduleRepositoryItem)];
                            case 3:
                                resultBuild = _a.sent();
                                results.push(resultBuild);
                                _a.label = 4;
                            case 4:
                                res.send(results);
                                return [2 /*return*/];
                        }
                    });
                }); });
                registerRoute_1.registerRoute(helper.moduleApiRouter, apiRoutes_1.routes.deleteModule, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    var moduleRepositoryItem, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('ModuleController.remove');
                                moduleRepositoryItem = helper.backendService.moduleManager.get(req.params.moduleName);
                                if (!moduleRepositoryItem) return [3 /*break*/, 2];
                                return [4 /*yield*/, helper.backendService.moduleManager.remove(moduleRepositoryItem)];
                            case 1:
                                result = _a.sent();
                                res.send([result]);
                                return [3 /*break*/, 3];
                            case 2:
                                res.sendStatus(404);
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                registerRoute_1.registerRoute(helper.moduleApiRouter, apiRoutes_1.routes.rebuildModule, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    var moduleRepositoryItem, resultInstall, resultBuild;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('ModuleController.rebuild');
                                moduleRepositoryItem = helper.backendService.moduleManager.get(req.params.moduleName);
                                if (!moduleRepositoryItem) return [3 /*break*/, 3];
                                return [4 /*yield*/, helper.backendService.moduleManager.install(moduleRepositoryItem)];
                            case 1:
                                resultInstall = _a.sent();
                                return [4 /*yield*/, helper.backendService.moduleManager.build(moduleRepositoryItem)];
                            case 2:
                                resultBuild = _a.sent();
                                res.send([resultInstall, resultBuild]);
                                return [3 /*break*/, 4];
                            case 3:
                                res.sendStatus(404);
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                registerRoute_1.registerRoute(helper.moduleApiRouter, apiRoutes_1.routes.updateModule, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    var moduleRepositoryItem, results, resultUpdate, resultInstall, resultBuild;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('ModuleController.update');
                                moduleRepositoryItem = helper.backendService.moduleManager.get(req.params.moduleName);
                                if (!moduleRepositoryItem) return [3 /*break*/, 5];
                                results = [];
                                if (!moduleRepositoryItem.hasUpdates) return [3 /*break*/, 4];
                                return [4 /*yield*/, helper.backendService.moduleManager.update(moduleRepositoryItem)];
                            case 1:
                                resultUpdate = _a.sent();
                                results.push(resultUpdate);
                                return [4 /*yield*/, helper.backendService.moduleManager.install(moduleRepositoryItem)];
                            case 2:
                                resultInstall = _a.sent();
                                results.push(resultInstall);
                                return [4 /*yield*/, helper.backendService.moduleManager.build(moduleRepositoryItem)];
                            case 3:
                                resultBuild = _a.sent();
                                results.push(resultBuild);
                                _a.label = 4;
                            case 4:
                                res.send(results);
                                return [3 /*break*/, 6];
                            case 5:
                                res.sendStatus(404);
                                _a.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return ModuleController;
}());
exports.ModuleController = ModuleController;
//# sourceMappingURL=ModuleController.js.map