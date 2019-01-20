"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reactron_interfaces_1 = require("@schirkan/reactron-interfaces");
class LogWriter {
    constructor(topics, source) {
        this.topics = topics;
        this.source = source;
    }
    log(severity, message, data) {
        this.topics && this.topics.publish(reactron_interfaces_1.topicNames.log, { source: this.source, severity, message, data });
    }
    error(message, data) {
        this.log('error', message, data);
    }
    warning(message, data) {
        this.log('warning', message, data);
    }
    info(message, data) {
        this.log('information', message, data);
    }
    debug(message, data) {
        this.log('debug', message, data);
    }
}
exports.LogWriter = LogWriter;
//# sourceMappingURL=LogWriter.js.map