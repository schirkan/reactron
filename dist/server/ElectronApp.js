"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class ElectronApp {
    constructor(config) {
        this.config = config;
    }
    start() {
        console.log('ElectronApp is starting');
        return new Promise((resolve) => {
            const createWindow = () => {
                const mainScreen = electron_1.screen.getPrimaryDisplay();
                this.mainWindow = new electron_1.BrowserWindow({ width: mainScreen.size.width * 0.9, height: 700 });
                if (this.config.isDev) {
                    this.mainWindow.webContents.openDevTools();
                }
                else {
                    this.mainWindow.setFullScreen(true);
                }
                this.mainWindow.on('closed', () => {
                    delete (this.mainWindow);
                });
                if (resolve) {
                    console.log('ElectronApp is running');
                    resolve();
                    resolve = null;
                }
            };
            if (process.env.NODE_ENV === 'development') {
                const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
                installExtension(REACT_DEVELOPER_TOOLS)
                    .then((name) => console.log(`Added Extension:  ${name}`))
                    .catch((err) => console.log('An error occurred: ', err));
            }
            electron_1.app.on('ready', createWindow.bind(this));
            electron_1.app.on('window-all-closed', () => {
                // On OS X it is common for applications and their menu bar
                // to stay active until the user quits explicitly with Cmd + Q
                if (process.platform !== 'darwin') {
                    electron_1.app.quit();
                }
            });
            electron_1.app.on('activate', () => {
                // On OS X it's common to re-create a window in the app when the
                // dock icon is clicked and there are no other windows open.
                if (!this.mainWindow) {
                    createWindow();
                }
            });
        });
    }
    ;
}
exports.ElectronApp = ElectronApp;
//# sourceMappingURL=ElectronApp.js.map