"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class SystemCommand {
    static run(command, cwd) {
        return new Promise((resolve, reject) => {
            console.log('runCommand: ' + cwd + ' ' + command);
            const result = {
                command,
                args: cwd,
                children: [],
                log: [],
                success: true,
                timestampStart: Date.now(),
                timestampEnd: 0
            };
            child_process_1.exec(command, { cwd }, (error, stdout, stderr) => {
                if (stdout) {
                    result.log.push(stdout.trim());
                }
                if (stderr) {
                    result.log.push(stderr.trim());
                }
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
    }
}
exports.SystemCommand = SystemCommand;
//# sourceMappingURL=SystemCommand.js.map