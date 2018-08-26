var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;

var modulesPath = path.join(__dirname, 'modules');

function runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        console.log(cwd + ' ' + command);
        exec(command, { cwd }, (error, stdout, stderr) => {
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

// TODO: find package.json

function installModule(moduleName) {
    var moduleFolder = path.join(modulesPath, moduleName);
    console.log('started installModule() ' + moduleName);
    return runCommand('npm install', moduleFolder)
        .catch(() => console.log('ERROR npm install ' + moduleName))
        .then(() => runCommand('npm run build', moduleFolder))
        .catch(() => console.log('ERROR npm run build ' + moduleName))
        .then(() => console.log('finisched installModule() ' + moduleName));
}

fs.readdir(modulesPath, (err, items) => {
    console.log('modules', items);
    for (var i = 0; i < items.length; i++) {
        installModule(items[i]);
    }
});