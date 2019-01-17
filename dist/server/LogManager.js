"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reactron_interfaces_1 = require("@schirkan/reactron-interfaces");
var LogManager = /** @class */ (function () {
    function LogManager(topics) {
        var _this = this;
        this.repository = [];
        topics.subscribe(reactron_interfaces_1.topicNames.log, function (e, data) { return _this.writeLog(data); });
    }
    LogManager.prototype.writeLog = function (sourceOrLogEntry, severity, message, data) {
        if (typeof sourceOrLogEntry === 'string') {
            this.repository.push({
                timestamp: Date.now(),
                source: sourceOrLogEntry,
                severity: severity,
                message: message,
                data: data
            });
            console.log(sourceOrLogEntry + ': ' + message); // TODO
        }
        else if (typeof sourceOrLogEntry === 'object') {
            var i = sourceOrLogEntry;
            this.writeLog(i.source, i.severity, i.message, i.data);
        }
        else {
            console.log('LogManager: Parameter sourceOrLogEntry is missing!', arguments);
        }
    };
    LogManager.prototype.readLog = function (source) {
        if (source) {
            return this.repository.filter(function (x) { return x.source === source; });
        }
        return this.repository;
    };
    return LogManager;
}());
exports.LogManager = LogManager;
//# sourceMappingURL=LogManager.js.map