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
    getServices: new ApiRoute('/service/', 'get'),
    getServiceOptions: new ApiRoute('/service/getOptions', 'post'),
    setServiceOptions: new ApiRoute('/service/setOptions', 'post'),
    callServiceMethod: new ApiRoute('/service/rpc', 'post'),
    getModules: new ApiRoute('/modules/', 'get'),
    addModule: new ApiRoute('/modules/', 'post'),
    deleteModule: new ApiRoute('/modules/delete', 'delete'),
    rebuildModule: new ApiRoute('/modules/rebuild', 'post'),
    updateModule: new ApiRoute('/modules/update', 'post'),
    checkUpdates: new ApiRoute('/modules/checkUpdates', 'post'),
    getWebPages: new ApiRoute('/pages/', 'get'),
    setWebPage: new ApiRoute('/pages/', 'post'),
    deleteWebPage: new ApiRoute('/pages/:id', 'delete'),
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
    getLogEntries: new ApiRoute('/log/entries', 'post'),
};
//# sourceMappingURL=apiRoutes.js.map