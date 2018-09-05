"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var ExpressApp = /** @class */ (function () {
    function ExpressApp(config) {
        this.config = config;
    }
    ExpressApp.prototype.start = function () {
        var _this = this;
        console.log('ExpressApp is starting');
        return new Promise(function (resolve, reject) {
            _this.express = express();
            // parse application/x-www-form-urlencoded
            _this.express.use(express.urlencoded({ extended: false }));
            // parse application/json
            _this.express.use(express.json());
            _this.apiRouter = express.Router();
            // log calls
            _this.apiRouter.use(function (req, res, next) {
                console.log('Api call ' + req.method + ' ' + req.originalUrl, req.body);
                next();
            });
            _this.express.use('/api', _this.apiRouter);
            _this.express.use('/modules', express.static(_this.config.root + '/modules'));
            _this.express.use('/node_modules', express.static(_this.config.root + '/node_modules'));
            _this.express.use('/', express.static(_this.config.root + '/build'));
            // for react router
            _this.express.get('/*', function (req, res) {
                res.sendFile(path.join(_this.config.root + '/build/index.html'), function (err) {
                    if (err) {
                        res.status(500).send(err);
                    }
                });
            });
            // start listening
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