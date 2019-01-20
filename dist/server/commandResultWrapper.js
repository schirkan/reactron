"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = (commandName, args, callback) => __awaiter(this, void 0, void 0, function* () {
    const result = {
        args: args ? JSON.stringify(args) : '',
        children: [],
        log: [],
        command: commandName || callback.prototype.name + '.' + callback.name,
        success: undefined,
        timestampStart: Date.now(),
        timestampEnd: 0,
        data: undefined
    };
    // console.log('Start Command: ' + result.command + ' ' + result.args);
    try {
        const callbackResult = yield Promise.resolve(callback(result));
        // check if callbackResult is ICommandResult
        if (callbackResult && callbackResult.hasOwnProperty('success') && callbackResult.hasOwnProperty('command')) {
            const innerResult = callbackResult;
            result.success = innerResult.success;
            result.children.push(innerResult);
            result.data = innerResult.data;
        }
        result.data = result.data || callbackResult;
        // evaluate success
        if (result.success === undefined) {
            if (result.children.length) {
                result.success = result.children.every(x => x.success === true || x.success === undefined);
            }
            else {
                result.success = true;
            }
        }
    }
    catch (error) {
        console.log('Error in Command: ' + result.command + ' ' + result.args, error);
        const message = error && error.message || JSON.stringify(error);
        result.log.push(message);
        result.success = false;
    }
    result.timestampEnd = Date.now();
    // console.log('End Command: ' + result.command + ' ' + result.args + ' ' + (result.success ? 'success' : 'error'));
    return result;
});
//# sourceMappingURL=commandResultWrapper.js.map