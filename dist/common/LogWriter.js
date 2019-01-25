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
        this.log('error', message, LogWriter.prepareData(data));
    }
    warning(message, data) {
        this.log('warning', message, LogWriter.prepareData(data));
    }
    info(message, data) {
        this.log('information', message, LogWriter.prepareData(data));
    }
    debug(message, data) {
        this.log('debug', message, LogWriter.prepareData(data));
    }
    static prepareData(data) {
        if (data instanceof Error) {
            return Object.assign({}, data, { 
                // Explicitly pull Error's non-enumerable properties
                name: data.name, message: data.message, stack: data.stack });
            // return JSON.stringify(error, Object.getOwnPropertyNames(error))
        }
        // if (typeof data === 'object') {
        //   return { ...data }; // copy
        // }
        return data;
    }
}
exports.LogWriter = LogWriter;
//# sourceMappingURL=LogWriter.js.map