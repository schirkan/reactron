"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Emitter = require("events");
var PubSub = /** @class */ (function () {
    function PubSub() {
        this.__EMITTER__ = new Emitter.EventEmitter();
    }
    PubSub.prototype.subscribe = function (eventName, listener) {
        this.__EMITTER__.on(eventName, listener);
    };
    PubSub.prototype.once = function (eventName, listener) {
        this.__EMITTER__.once(eventName, listener);
    };
    PubSub.prototype.unsubscribe = function (eventName, listener) {
        this.__EMITTER__.removeListener(eventName, listener);
    };
    PubSub.prototype.publish = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        var event = { name: eventName };
        (_a = this.__EMITTER__).emit.apply(_a, [eventName, event].concat(args));
    };
    PubSub.prototype.clearAllSubscriptions = function () {
        this.__EMITTER__.removeAllListeners();
    };
    return PubSub;
}());
exports.PubSub = PubSub;
//# sourceMappingURL=PubSub.js.map