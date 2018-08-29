"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var ElectronApp = /** @class */ (function () {
    function ElectronApp(config) {
        this.config = config;
    }
    ElectronApp.prototype.start = function () {
        var _this = this;
        console.log('ElectronApp is starting');
        return new Promise(function (resolve) {
            var createWindow = function () {
                _this.mainWindow = new electron_1.BrowserWindow({ width: 900, height: 700 });
                if (_this.config.isDev) {
                    _this.mainWindow.webContents.openDevTools();
                }
                else {
                    _this.mainWindow.setFullScreen(true);
                }
                _this.mainWindow.on('closed', function () {
                    delete (_this.mainWindow);
                });
                if (resolve) {
                    console.log('ElectronApp is running');
                    resolve();
                    resolve = null;
                }
            };
            electron_1.app.on('ready', createWindow.bind(_this));
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
                if (!_this.mainWindow) {
                    createWindow();
                }
            });
        });
    };
    ;
    return ElectronApp;
}());
exports.ElectronApp = ElectronApp;
//# sourceMappingURL=ElectronApp.js.map