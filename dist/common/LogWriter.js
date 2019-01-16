"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogWriter = /** @class */ (function () {
    function LogWriter(logManager, source) {
        this.logManager = logManager;
        this.source = source;
    }
    LogWriter.prototype.error = function (message, data) {
        this.logManager && this.logManager.writeLog(this.source, 'error', message, data);
    };
    LogWriter.prototype.warning = function (message, data) {
        this.logManager && this.logManager.writeLog(this.source, 'warning', message, data);
    };
    LogWriter.prototype.info = function (message, data) {
        this.logManager && this.logManager.writeLog(this.source, 'information', message, data);
    };
    LogWriter.prototype.debug = function (message, data) {
        this.logManager && this.logManager.writeLog(this.source, 'debug', message, data);
    };
    return LogWriter;
}());
exports.LogWriter = LogWriter;
//# sourceMappingURL=LogWriter.js.map