"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoutes_1 = require("../../common/apiRoutes");
const BackendService_1 = require("../BackendService");
class ServiceController {
    constructor(context) {
        this.context = context;
        this.registerRoute = (route, handler) => {
            this.context.log.debug('Register route: ' + route.method + ' ' + route.path);
            const router = this.context.moduleApiRouter;
            const method = router[route.method.toLowerCase()].bind(router);
            const internalHandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let data = undefined;
                    if (req.params && Object.keys(req.params).length) {
                        data = req.params;
                    }
                    this.context.log.debug('Call route: ' + route.method + ' ' + route.path, data);
                    yield handler(req, res, next);
                }
                catch (error) {
                    this.context.log.error('Error in route: ' + route.method + ' ' + route.path, error && error.message || error);
                }
            });
            method(route.path, internalHandler);
        };
    }
    getAllServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield BackendService_1.BackendService.instance.serviceRepository.getAll();
            const serviceInfos = result.map(item => {
                const { instance, service, context } = item, serviceInfo = __rest(item, ["instance", "service", "context"]);
                return serviceInfo;
            });
            return serviceInfos;
        });
    }
    getServiceOptions(moduleName, serviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            return BackendService_1.BackendService.instance.serviceOptionsRepository.get(moduleName, serviceName);
        });
    }
    setServiceOptions(moduleName, serviceName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BackendService_1.BackendService.instance.serviceManager.setOptions(moduleName, serviceName, options);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.registerRoute(apiRoutes_1.routes.callServiceMethod, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const service = BackendService_1.BackendService.instance.serviceManager.get(req.body.moduleName, req.body.serviceName);
                let method = service && service[req.body.methodName];
                // TODO
                // console.log('callServiceMethod', req.body.args);
                if (!method) {
                    res.sendStatus(404);
                }
                else {
                    try {
                        method = method.bind(service);
                        const result = yield Promise.resolve(method(...req.body.args));
                        res.send({ result });
                    }
                    catch (error) {
                        res.send({ error: JSON.stringify(error, Object.getOwnPropertyNames(error)) }); // error && error.message || error
                    }
                }
            }));
        });
    }
}
exports.ServiceController = ServiceController;
//# sourceMappingURL=ServiceController.js.map