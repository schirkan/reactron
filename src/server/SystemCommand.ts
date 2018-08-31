import { exec } from 'child_process';
import { ICommandResult } from '../interfaces/ICommandResult';

export class SystemCommand {
    public static run(command: string, cwd: string): Promise<ICommandResult> {
        return new Promise((resolve, reject) => {
            console.log('runCommand: ' + cwd + ' ' + command);

            const result = {
                command,
                args: cwd,
                timestampStart: Date.now()
            } as ICommandResult;

            exec(command, { cwd }, (error: any, stdout: string, stderr: string) => {
                result.message = 'stdout: ' + stdout + '\n\nstderr: ' + stderr;
                result.timestampEnd = Date.now();
                result.success = !!error;

                if (result.success) {
                    result.message += '\n\nerror:' + JSON.stringify(error);
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        });
    }
}