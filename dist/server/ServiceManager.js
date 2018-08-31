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
            var serviceRepositoryItem, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('ServiceManager.get: ' + moduleName + '.' + serviceName);
                        serviceRepositoryItem = this.serviceRepository.get(moduleName, serviceName);
                        if (!!serviceRepositoryItem) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadService(moduleName, serviceName)];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            serviceRepositoryItem = this.serviceRepository.get(moduleName, serviceName);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, serviceRepositoryItem && serviceRepositoryItem.instance];
                }
            });
        });
    };
    ServiceManager.prototype.startAllServices = function () {
        var _this = this;
        return commandResultWrapper_1.command('startAllServices', undefined, function (result) { return __awaiter(_this, void 0, void 0, function () {
            var modules, i, m, servicesTypes, exportKeys, j, serviceName, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        modules = this.moduleRepository.getAll();
                        result.log.push('Modules: ' + JSON.stringify(modules.map(function (x) { return x.name; })));
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < modules.length)) return [3 /*break*/, 6];
                        m = modules[i];
                        result.log.push('Loading: ' + m.serverFile);
                        servicesTypes = require(m.serverFile);
                        exportKeys = Object.keys(servicesTypes);
                        result.log.push('Exports: ' + JSON.stringify(exportKeys));
                        j = 0;
                        _c.label = 2;
                    case 2:
                        if (!(j < exportKeys.length)) return [3 /*break*/, 5];
                        serviceName = exportKeys[j];
                        _b = (_a = result.children).push;
                        return [4 /*yield*/, this.loadService(m.name, serviceName)];
                    case 3:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 4;
                    case 4:
                        j++;
                        return [3 /*break*/, 2];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    ServiceManager.prototype.stopAllServices = function () {
        var _this = this;
        return commandResultWrapper_1.command('stopAllServices', undefined, function (result) { return __awaiter(_this, void 0, void 0, function () {
            var services, i, serviceRepositoryItem, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        services = this.serviceRepository.getAll();
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < services.length)) return [3 /*break*/, 4];
                        serviceRepositoryItem = services[i];
                        _b = (_a = result.children).push;
                        return [4 /*yield*/, this.stopService(serviceRepositoryItem)];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    ServiceManager.prototype.stopService = function (serviceRepositoryItem) {
        var _this = this;
        var serviceKey = serviceRepositoryItem.moduleName + '.' + serviceRepositoryItem.name;
        return commandResultWrapper_1.command('stopService', serviceKey, function (result) { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (serviceRepositoryItem.state === "stopped") {
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!serviceRepositoryItem.instance.start) return [3 /*break*/, 3];
                        return [4 /*yield*/, serviceRepositoryItem.instance.stop()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        serviceRepositoryItem.state = "stopped";
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        serviceRepositoryItem.state = "error";
                        serviceRepositoryItem.log.push(error_1);
                        result.log.push('Error stopping service: ' + serviceKey);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    ServiceManager.prototype.startService = function (serviceRepositoryItem) {
        var _this = this;
        var serviceKey = serviceRepositoryItem.moduleName + '.' + serviceRepositoryItem.name;
        return commandResultWrapper_1.command('startService', serviceKey, function (result) { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (serviceRepositoryItem.state === "starting" || serviceRepositoryItem.state === "running") {
                            return [2 /*return*/];
                        }
                        serviceRepositoryItem.state = "starting";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!serviceRepositoryItem.instance.start) return [3 /*break*/, 3];
                        return [4 /*yield*/, serviceRepositoryItem.instance.start(this)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        serviceRepositoryItem.state = "running";
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        serviceRepositoryItem.state = "error";
                        serviceRepositoryItem.log.push(error_2);
                        result.log.push('Error starting service: ' + serviceKey);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    ServiceManager.prototype.setOptions = function (serviceRepositoryItem, options) {
        var _this = this;
        return commandResultWrapper_1.command('setOptions', serviceRepositoryItem.moduleName + '.' + serviceRepositoryItem.name, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!serviceRepositoryItem.instance.setOptions) return [3 /*break*/, 2];
                        return [4 /*yield*/, serviceRepositoryItem.instance.setOptions(options)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
    };
    ServiceManager.prototype.loadService = function (moduleName, serviceName) {
        var _this = this;
        var serviceKey = moduleName + '.' + serviceName;
        return commandResultWrapper_1.command('loadService', serviceKey, function (result) { return __awaiter(_this, void 0, void 0, function () {
            var moduleDefinition, serviceTypes, serviceType, serviceInstance, serviceRepositoryItem, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (this.serviceRepository.get(moduleName, serviceName)) {
                            return [2 /*return*/]; // already running
                        }
                        moduleDefinition = this.moduleRepository.get(moduleName);
                        if (!moduleDefinition) {
                            throw new Error('Module not found: ' + moduleName);
                        }
                        try {
                            result.log.push('Loading: ' + moduleDefinition.serverFile);
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
                        serviceRepositoryItem = {
                            name: serviceName,
                            moduleName: moduleName,
                            instance: serviceInstance,
                            log: [],
                            description: '',
                            state: 'stopped',
                            options: {} // TODO
                        };
                        this.serviceRepository.add(serviceRepositoryItem);
                        _b = (_a = result.children).push;
                        return [4 /*yield*/, this.setOptions(serviceRepositoryItem, serviceRepositoryItem.options)];
                    case 1:
                        _b.apply(_a, [_e.sent()]);
                        _d = (_c = result.children).push;
                        return [4 /*yield*/, this.startService(serviceRepositoryItem)];
                    case 2:
                        _d.apply(_c, [_e.sent()]);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return ServiceManager;
}());
exports.ServiceManager = ServiceManager;
//# sourceMappingURL=ServiceManager.js.map