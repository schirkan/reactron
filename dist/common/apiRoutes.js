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
    addModule: new ApiRoute('/modules/:repository', 'post'),
    getModule: new ApiRoute('/modules/:moduleName', 'get'),
    deleteModule: new ApiRoute('/modules/:moduleName', 'delete'),
    buildModule: new ApiRoute('/modules/:moduleName/build', 'post'),
    installModule: new ApiRoute('/modules/:moduleName/install', 'post'),
    updateModule: new ApiRoute('/modules/:moduleName/update', 'post'),
    getWebPages: new ApiRoute('/pages/', 'get'),
    setWebPage: new ApiRoute('/pages/', 'post'),
    deleteWebPage: new ApiRoute('/pages/:path', 'delete'),
    getServerInfo: new ApiRoute('/app/', 'get'),
    exitApplication: new ApiRoute('/app/exitApplication', 'post'),
    restartApplication: new ApiRoute('/app/restartApplication', 'post'),
    shutdownSystem: new ApiRoute('/app/shutdownSystem', 'post'),
    rebootSystem: new ApiRoute('/app/restartSystem', 'post'),
    resetApplication: new ApiRoute('/app/resetApplication', 'post'),
    getSettings: new ApiRoute('/settings/', 'get'),
    setSettings: new ApiRoute('/settings/', 'post'),
    getWebComponentOptions: new ApiRoute('/components/', 'get'),
    setWebComponentOptions: new ApiRoute('/components/', 'post'),
    deleteWebComponentOptions: new ApiRoute('/components/:id', 'delete'),
};
//# sourceMappingURL=apiRoutes.js.map