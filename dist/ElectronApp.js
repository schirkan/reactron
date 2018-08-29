"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var ElectronApp = /** @class */ (function () {
    function ElectronApp(port, isDev) {
        this.port = port;
        this.isDev = isDev;
    }
    ElectronApp.prototype.createWindow = function () {
        var _this = this;
        this.mainWindow = new electron_1.BrowserWindow({ width: 900, height: 700 });
        this.mainWindow.setFullScreen(true);
        this.mainWindow.loadURL('http://localhost:' + this.port);
        console.log('ElectronApp.start()', { port: this.port, isDev: this.isDev });
        if (this.isDev) {
            this.mainWindow.webContents.openDevTools();
        }
        this.mainWindow.on('closed', function () {
            delete (_this.mainWindow);
        });
    };
    ElectronApp.prototype.start = function () {
        var _this = this;
        electron_1.app.on('ready', this.createWindow.bind(this));
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
                _this.createWindow();
            }
        });
    };
    ;
    return ElectronApp;
}());
exports.ElectronApp = ElectronApp;
//# sourceMappingURL=ElectronApp.js.map