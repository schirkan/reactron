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
const rpc_1 = require("../../common/rpc");
const BackendService_1 = require("../BackendService");
class ServiceController {
    constructor(context) {
        this.context = context;
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
            this.context.log.debug('Register route: ' + rpc_1.rpcPath);
            this.context.moduleApiRouter.post(rpc_1.rpcPath + '/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
                let response;
                try {
                    const data = req.body;
                    const service = BackendService_1.BackendService.instance.serviceManager.get(data.moduleName, data.serviceName);
                    const method = service && service[data.methodName];
                    if (!method) {
                        response = { error: 'RPC method not found' };
                        this.context.log.error('RPC method not found: ' + req.params.id, data);
                    }
                    else {
                        const result = yield Promise.resolve(method.apply(service, data.args));
                        response = { result };
                    }
                }
                catch (error) {
                    response = { error: error && error.message || error };
                    // const newError = JSON.stringify(error, Object.getOwnPropertyNames(error));
                    // this.context.log.error('Error in route: ' + rpcPath, newError);
                }
                res.send(response);
            }));
        });
    }
}
exports.ServiceController = ServiceController;
//# sourceMappingURL=ServiceController.js.map