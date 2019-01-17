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
var express = require("express");
var BackendService_1 = require("./BackendService");
var LogWriter_1 = require("./../common/LogWriter");
// tslint:disable-next-line:no-var-requires
var Store = require('electron-store');
var ReactronServiceContext = /** @class */ (function () {
    function ReactronServiceContext(moduleName, serviceName) {
        var _this = this;
        this.moduleName = moduleName;
        this.serviceName = serviceName;
        this.backendService = BackendService_1.BackendService.instance;
        this.registerRoute = function (route, handler) {
            _this.log.debug('Register route: ' + route.method + ' ' + route.path);
            var router = _this.moduleApiRouter;
            var method = router[route.method.toLowerCase()].bind(router);
            var internalHandler = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.log.debug('Call route: ' + route.method + ' ' + route.path);
                            return [4 /*yield*/, handler(req, res, next)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.log.error('Error in route: ' + route.method + ' ' + route.path, error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            method(route.path, internalHandler);
        };
        this.moduleContext = InternalModuleContext.getModuleContext(this.backendService, this.moduleName);
        this.log = new LogWriter_1.LogWriter(this.backendService.topics, moduleName + '.' + serviceName);
        // this.log.debug('Module Api Path: ' + this.moduleContext.moduleApiPath);
    }
    Object.defineProperty(ReactronServiceContext.prototype, "moduleStorage", {
        get: function () {
            return this.moduleContext.moduleStorage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactronServiceContext.prototype, "moduleApiRouter", {
        get: function () {
            return this.moduleContext.moduleApiRouter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactronServiceContext.prototype, "settings", {
        get: function () {
            return this.backendService.settings.get();
        },
        enumerable: true,
        configurable: true
    });
    ReactronServiceContext.prototype.getService = function (serviceName, moduleName) {
        return this.backendService.serviceManager.get(moduleName || this.moduleName, serviceName);
    };
    ReactronServiceContext.prototype.getServiceAsync = function (serviceName, moduleName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.backendService.serviceManager.getAsync(moduleName || this.moduleName, serviceName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ReactronServiceContext.getServiceContext = function (moduleName, serviceName) {
        var context = ReactronServiceContext.serviceContexts.find(function (x) { return x.moduleName === moduleName && x.serviceName === serviceName; });
        if (!context) {
            context = new ReactronServiceContext(moduleName, serviceName);
            ReactronServiceContext.serviceContexts.push(context);
        }
        return context;
    };
    ReactronServiceContext.serviceContexts = [];
    return ReactronServiceContext;
}());
exports.ReactronServiceContext = ReactronServiceContext;
var InternalModuleContext = /** @class */ (function () {
    function InternalModuleContext(backendService, moduleName) {
        this.moduleName = moduleName;
        this.moduleStorage = new Store({ name: 'module.' + moduleName });
        this.moduleApiRouter = express.Router();
        var escapedModuleName = moduleName.replace('/', '@');
        this.moduleApiPath = '/modules/' + escapedModuleName;
        backendService.expressApp.apiRouter.use(this.moduleApiPath, this.moduleApiRouter);
    }
    InternalModuleContext.getModuleContext = function (backendService, moduleName) {
        var context = InternalModuleContext.moduleContexts.find(function (x) { return x.moduleName === moduleName; });
        if (!context) {
            context = new InternalModuleContext(backendService, moduleName);
            InternalModuleContext.moduleContexts.push(context);
        }
        return context;
    };
    InternalModuleContext.moduleContexts = [];
    return InternalModuleContext;
}());
//# sourceMappingURL=ReactronServiceContext.js.map