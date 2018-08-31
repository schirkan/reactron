import { exec } from 'child_process';
import { ICommandResult } from '../interfaces/ICommandResult';

export class SystemCommand {
    public static run(command: string, cwd: string): Promise<ICommandResult> {
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
            } as ICommandResult;

            exec(command, { cwd }, (error: any, stdout: string, stderr: string) => {
                result.log.push('stdout: ' + stdout);
                result.log.push('stderr: ' + stderr);
                result.timestampEnd = Date.now();
                result.success = !!error;

                if (error) {
                    result.log.push('error: ' + JSON.stringify(error));
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        });
    }
}