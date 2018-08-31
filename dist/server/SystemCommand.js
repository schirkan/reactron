"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var SystemCommand = /** @class */ (function () {
    function SystemCommand() {
    }
    SystemCommand.run = function (command, cwd) {
        return new Promise(function (resolve, reject) {
            console.log('runCommand: ' + cwd + ' ' + command);
            var result = {
                command: command,
                args: cwd,
                timestampStart: Date.now()
            };
            child_process_1.exec(command, { cwd: cwd }, function (error, stdout, stderr) {
                result.message = 'stdout: ' + stdout + '\n\nstderr: ' + stderr;
                result.timestampEnd = Date.now();
                result.success = !!error;
                if (result.success) {
                    result.message += '\n\nerror:' + JSON.stringify(error);
                    reject(result);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
    return SystemCommand;
}());
exports.SystemCommand = SystemCommand;
//# sourceMappingURL=SystemCommand.js.map