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
class ServiceController {
    start(context) {
        return __awaiter(this, void 0, void 0, function* () {
            context.registerRoute(apiRoutes_1.routes.getServices, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const result = yield context.backendService.serviceRepository.getAll();
                const serviceInfos = result.map(item => {
                    const { instance, service, context } = item, serviceInfo = __rest(item, ["instance", "service", "context"]);
                    return serviceInfo;
                });
                res.send(serviceInfos);
            }));
            context.registerRoute(apiRoutes_1.routes.getServiceOptions, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const result = context.backendService.serviceOptionsRepository.get(req.body.moduleName, req.body.serviceName);
                res.send(result);
            }));
            context.registerRoute(apiRoutes_1.routes.setServiceOptions, (req, res) => __awaiter(this, void 0, void 0, function* () {
                yield context.backendService.serviceManager.setOptions(req.body.moduleName, req.body.serviceName, req.body.options);
                res.sendStatus(204);
            }));
            context.registerRoute(apiRoutes_1.routes.callServiceMethod, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const service = context.backendService.serviceManager.get(req.body.moduleName, req.body.serviceName);
                let method = service && service[req.body.methodName];
                console.log('callServiceMethod', req.body.args);
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
                        res.send({ error: error && error.message || error });
                    }
                }
            }));
        });
    }
}
exports.ServiceController = ServiceController;
//# sourceMappingURL=ServiceController.js.map