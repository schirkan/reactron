"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ExpressApp = /** @class */ (function () {
    function ExpressApp(port, root) {
        this.port = port;
        this.root = root;
    }
    ExpressApp.prototype.start = function () {
        var _this = this;
        // return new Promise<void>((resolve, reject) => {
        this.express = express();
        this.express.use('/modules', express.static(this.root + '/modules'));
        this.express.use('/node_modules', express.static(this.root + '/node_modules'));
        this.express.use('/', express.static(this.root + '/build'));
        this.server = this.express.listen(this.port, function () {
            console.log('ExpressApp listening on Port ' + _this.port);
            // resolve();
        });
        // });
    };
    return ExpressApp;
}());
exports.ExpressApp = ExpressApp;
//# sourceMappingURL=ExpressApp.js.map