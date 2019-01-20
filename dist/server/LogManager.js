"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reactron_interfaces_1 = require("@schirkan/reactron-interfaces");
class LogManager {
    constructor(topics) {
        this.repository = [];
        topics.subscribe(reactron_interfaces_1.topicNames.log, (e, data) => this.writeLog(data));
    }
    writeLog(sourceOrLogEntry, severity, message, data) {
        if (typeof sourceOrLogEntry === 'string') {
            this.repository.push({
                timestamp: Date.now(),
                source: sourceOrLogEntry,
                severity,
                message,
                data
            });
            console.log(sourceOrLogEntry + ': ' + message); // TODO
        }
        else if (typeof sourceOrLogEntry === 'object') {
            const i = sourceOrLogEntry;
            this.writeLog(i.source, i.severity, i.message, i.data);
        }
        else {
            console.log('LogManager: Parameter sourceOrLogEntry is missing!', arguments);
        }
    }
    readLog(source) {
        if (source) {
            return this.repository.filter(x => x.source === source);
        }
        return this.repository;
    }
}
exports.LogManager = LogManager;
//# sourceMappingURL=LogManager.js.map