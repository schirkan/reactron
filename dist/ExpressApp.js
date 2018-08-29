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
        return new Promise(function (resolve, reject) {
            _this.express = express();
            _this.express.use('/modules', express.static(_this.root + '/modules'));
            _this.express.use('/node_modules', express.static(_this.root + '/node_modules'));
            _this.express.use('/', express.static(_this.root + '/build'));
            _this.server = _this.express.listen(_this.port, function () {
                console.log('ExpressApp listening on Port ' + _this.port);
                resolve();
            });
        });
    };
    return ExpressApp;
}());
exports.ExpressApp = ExpressApp;
//# sourceMappingURL=ExpressApp.js.map