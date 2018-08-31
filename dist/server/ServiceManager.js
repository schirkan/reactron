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
var commandResultWrapper_1 = require("./commandResultWrapper");
// dependency loader für services
var ServiceManager = /** @class */ (function () {
    function ServiceManager(serviceRepository, moduleRepository) {
        this.serviceRepository = serviceRepository;
        this.moduleRepository = moduleRepository;
    }
    ServiceManager.prototype.get = function (moduleName, serviceName) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('ServiceManager.get: ' + moduleName + '.' + serviceName);
                        serviceInstance = this.serviceRepository.get(moduleName, serviceName);
                        if (!!serviceInstance) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.startService(moduleName, serviceName)];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            // retry
                            serviceInstance = this.serviceRepository.get(moduleName, serviceName);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, serviceInstance];
                }
            });
        });
    };
    ServiceManager.prototype.startAllServices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, commandResultWrapper_1.command('startAllServices', undefined, function () { return __awaiter(_this, void 0, void 0, function () {
                            var modules, childResults, i, m, servicesTypes, exportKeys, j, serviceName, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        modules = this.moduleRepository.getAll();
                                        childResults = [];
                                        console.log('Modules: ' + JSON.stringify(modules.map(function (x) { return x.name; })));
                                        i = 0;
                                        _a.label = 1;
                                    case 1:
                                        if (!(i < modules.length)) return [3 /*break*/, 6];
                                        m = modules[i];
                                        console.log('Loading: ' + m.serverFile);
                                        servicesTypes = require(m.serverFile);
                                        exportKeys = Object.keys(servicesTypes);
                                        console.log('Exports: ' + JSON.stringify(exportKeys));
                                        j = 0;
                                        _a.label = 2;
                                    case 2:
                                        if (!(j < exportKeys.length)) return [3 /*break*/, 5];
                                        serviceName = exportKeys[j];
                                        return [4 /*yield*/, this.startService(m.name, serviceName)];
                                    case 3:
                                        result = _a.sent();
                                        childResults.push(result);
                                        _a.label = 4;
                                    case 4:
                                        j++;
                                        return [3 /*break*/, 2];
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 1];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ServiceManager.prototype.stopAllServices = function () {
        var _this = this;
        return commandResultWrapper_1.command('stopAllServices', undefined, function () { return __awaiter(_this, void 0, void 0, function () {
            var services, childResults, _a, _b, _i, key, serviceInstance, loadResult;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        services = this.serviceRepository.getAll();
                        childResults = [];
                        _a = [];
                        for (_b in services)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        key = _a[_i];
                        if (!services.hasOwnProperty(key)) return [3 /*break*/, 3];
                        serviceInstance = services[key];
                        return [4 /*yield*/, this.stopService(serviceInstance, key)];
                    case 2:
                        loadResult = _c.sent();
                        childResults.push(loadResult);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    ServiceManager.prototype.stopService = function (serviceInstance, serviceKey) {
        var _this = this;
        return commandResultWrapper_1.command('stopService', serviceKey, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, serviceInstance.stop()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ServiceManager.prototype.startService = function (moduleName, serviceName) {
        var _this = this;
        return commandResultWrapper_1.command('startService', arguments, function () { return __awaiter(_this, void 0, void 0, function () {
            var moduleDefinition, serviceTypes, serviceType, serviceInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.serviceRepository.get(moduleName, serviceName)) {
                            return [2 /*return*/]; // already running
                        }
                        moduleDefinition = this.moduleRepository.get(moduleName);
                        if (!moduleDefinition) {
                            throw new Error('Module not found: ' + moduleName);
                        }
                        try {
                            console.log('Loading: ' + moduleDefinition.serverFile);
                            serviceTypes = require(moduleDefinition.serverFile);
                        }
                        catch (error) {
                            throw new Error('Error importing Module: ' + moduleDefinition.serverFile);
                        }
                        serviceType = serviceTypes[serviceName];
                        if (!serviceType) {
                            throw new Error('Service not found: ' + serviceName);
                        }
                        serviceInstance = new serviceType();
                        // start service
                        return [4 /*yield*/, serviceInstance.start(this)];
                    case 1:
                        // start service
                        _a.sent();
                        console.log('Service started: ' + moduleName + '.' + serviceName, serviceInstance);
                        this.serviceRepository.add(moduleName, serviceName, serviceInstance);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return ServiceManager;
}());
exports.ServiceManager = ServiceManager;
//# sourceMappingURL=ServiceManager.js.map