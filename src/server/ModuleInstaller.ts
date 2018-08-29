import { exec } from 'child_process';
import * as path from 'path';
import { IBackendServiceConfig } from '../interfaces/IBackendServiceConfig';

export class ModuleInstaller {
    private modulesPath: string;

    constructor(
        private config: IBackendServiceConfig
    ) {
        this.modulesPath = path.join(this.config.root, 'modules');
    }

    public installModule(moduleName: string) {
        const moduleFolder = path.join(this.modulesPath, moduleName);
        console.log('started installModule() ' + moduleName);
        return this.runCommand('npm install', moduleFolder)
            .catch(() => console.log('ERROR npm install ' + moduleName))
            .then(() => this.runCommand('npm run build', moduleFolder))
            .catch(() => console.log('ERROR npm run build ' + moduleName))
            .then(() => console.log('finisched installModule() ' + moduleName));
    }

    public runCommand(command: string, cwd: string) {
        return new Promise((resolve, reject) => {
            console.log(cwd + ' ' + command);
            exec(command, { cwd }, (error: any, stdout: string, stderr: string) => {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error) {
                    console.log('exec error: ' + error);
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }
}