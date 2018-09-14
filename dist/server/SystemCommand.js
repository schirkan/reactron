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
                children: [],
                log: [],
                success: true,
                timestampStart: Date.now(),
                timestampEnd: 0
            };
            child_process_1.exec(command, { cwd: cwd }, function (error, stdout, stderr) {
                result.log.push('stdout: ' + stdout);
                result.log.push('stderr: ' + stderr);
                result.timestampEnd = Date.now();
                result.success = !error;
                if (error) {
                    result.log.push('error: ' + JSON.stringify(error));
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