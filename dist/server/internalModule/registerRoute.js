"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoute = function (router, route, handler) {
    var method = router[route.method.toLowerCase()];
    method(handler);
};
//# sourceMappingURL=registerRoute.js.map