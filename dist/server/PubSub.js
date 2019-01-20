"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reactron_interfaces_1 = require("@schirkan/reactron-interfaces");
const Emitter = require("events");
class PubSub {
    constructor() {
        this.__EMITTER__ = new Emitter.EventEmitter();
    }
    subscribe(eventName, listener) {
        console.log('subscribe: ' + eventName);
        this.__EMITTER__.on(eventName, listener);
    }
    once(eventName, listener) {
        this.__EMITTER__.once(eventName, listener);
    }
    unsubscribe(eventName, listener) {
        this.__EMITTER__.removeListener(eventName, listener);
    }
    publish(eventName, ...args) {
        if (eventName !== reactron_interfaces_1.topicNames.log) {
            console.log('publish: ' + eventName, args);
        }
        const event = { name: eventName };
        this.__EMITTER__.emit(eventName, event, ...args);
    }
    clearAllSubscriptions() {
        this.__EMITTER__.removeAllListeners();
    }
}
exports.PubSub = PubSub;
//# sourceMappingURL=PubSub.js.map