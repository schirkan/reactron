"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ExpressApp = /** @class */ (function () {
    function ExpressApp(config) {
        this.config = config;
    }
    ExpressApp.prototype.start = function () {
        var _this = this;
        console.log('ExpressApp is starting');
        return new Promise(function (resolve, reject) {
            _this.express = express();
            _this.express.use('/modules', express.static(_this.config.root + '/modules'));
            _this.express.use('/node_modules', express.static(_this.config.root + '/node_modules'));
            _this.express.use('/', express.static(_this.config.root + '/build'));
            _this.server = _this.express.listen(_this.config.backendPort, function () {
                console.log('ExpressApp is listening on Port ' + _this.config.backendPort);
                resolve();
            });
        });
    };
    return ExpressApp;
}());
exports.ExpressApp = ExpressApp;
//# sourceMappingURL=ExpressApp.js.map