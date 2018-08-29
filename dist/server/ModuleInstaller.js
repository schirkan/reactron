"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var path = require("path");
var ModuleInstaller = /** @class */ (function () {
    function ModuleInstaller(config) {
        this.config = config;
        this.modulesPath = path.join(this.config.root, 'modules');
    }
    ModuleInstaller.prototype.installModule = function (moduleName) {
        var _this = this;
        var moduleFolder = path.join(this.modulesPath, moduleName);
        console.log('started installModule() ' + moduleName);
        return this.runCommand('npm install', moduleFolder)
            .catch(function () { return console.log('ERROR npm install ' + moduleName); })
            .then(function () { return _this.runCommand('npm run build', moduleFolder); })
            .catch(function () { return console.log('ERROR npm run build ' + moduleName); })
            .then(function () { return console.log('finisched installModule() ' + moduleName); });
    };
    ModuleInstaller.prototype.runCommand = function (command, cwd) {
        return new Promise(function (resolve, reject) {
            console.log(cwd + ' ' + command);
            child_process_1.exec(command, { cwd: cwd }, function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error) {
                    console.log('exec error: ' + error);
                    reject();
                }
                else {
                    resolve();
                }
            });
        });
    };
    return ModuleInstaller;
}());
exports.ModuleInstaller = ModuleInstaller;
//# sourceMappingURL=ModuleInstaller.js.map