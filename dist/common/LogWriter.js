"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reactron_interfaces_1 = require("@schirkan/reactron-interfaces");
var LogWriter = /** @class */ (function () {
    function LogWriter(topics, source) {
        this.topics = topics;
        this.source = source;
    }
    LogWriter.prototype.log = function (severity, message, data) {
        this.topics && this.topics.publish(reactron_interfaces_1.topicNames.log, { source: this.source, severity: severity, message: message, data: data });
    };
    LogWriter.prototype.error = function (message, data) {
        this.log('error', message, data);
    };
    LogWriter.prototype.warning = function (message, data) {
        this.log('warning', message, data);
    };
    LogWriter.prototype.info = function (message, data) {
        this.log('information', message, data);
    };
    LogWriter.prototype.debug = function (message, data) {
        this.log('debug', message, data);
    };
    return LogWriter;
}());
exports.LogWriter = LogWriter;
//# sourceMappingURL=LogWriter.js.map