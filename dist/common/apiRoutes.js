"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiRoute {
    constructor(path, method) {
        this.path = path;
        this.method = method;
    }
}
exports.ApiRoute = ApiRoute;
exports.routes = {
    callServiceMethod: new ApiRoute('/service/rpc', 'post'),
};
//# sourceMappingURL=apiRoutes.js.map