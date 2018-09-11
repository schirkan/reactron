"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiRoute = /** @class */ (function () {
    function ApiRoute(path, method) {
        this.path = path;
        this.method = method;
    }
    return ApiRoute;
}());
exports.ApiRoute = ApiRoute;
exports.routes = {
    getServices: new ApiRoute('/service/', 'get'),
    getServiceOptions: new ApiRoute('/service/:moduleName/:serviceName', 'get'),
    setServiceOptions: new ApiRoute('/service/:moduleName/:serviceName', 'post'),
    getModules: new ApiRoute('/modules/', 'get'),
    getWebPages: new ApiRoute('/pages/', 'get'),
    setWebPage: new ApiRoute('/pages/', 'post'),
    deleteWebPage: new ApiRoute('/pages/:path', 'delete'),
    getWebComponentOptions: new ApiRoute('/components/', 'get'),
    setWebComponentOptions: new ApiRoute('/components/', 'post'),
    deleteWebComponentOptions: new ApiRoute('/components/:id', 'delete'),
};
//# sourceMappingURL=apiRoutes.js.map