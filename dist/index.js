"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var express = require("express");
exports.start = function (root) {
    var isDev = process.env.NODE_ENV !== 'production';
    var port = isDev ? 5000 : 3000;
    var server = express();
    server.use('/modules', express.static(root + '/modules'));
    server.use('/node_modules', express.static(root + '/node_modules'));
    server.use('/', express.static(root + '/build'));
    server.listen(port, function () {
        console.log('NODE_ENV = ' + process.env.NODE_ENV);
        console.log('Server listening on Port ' + port);
    });
    var mainWindow;
    function createWindow() {
        mainWindow = new electron_1.BrowserWindow({ width: 800, height: 600 });
        mainWindow.setFullScreen(true);
        mainWindow.loadURL("http://localhost:3000");
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
        mainWindow.on('closed', function () {
            mainWindow = null;
        });
    }
    electron_1.app.on('ready', createWindow);
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow();
        }
    });
};
//# sourceMappingURL=index.js.map