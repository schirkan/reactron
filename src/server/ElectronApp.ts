import { app, BrowserWindow } from "electron";
import { IBackendServiceConfig } from "./IBackendServiceConfig";

export class ElectronApp {
    public mainWindow: Electron.BrowserWindow;

    constructor(private config: IBackendServiceConfig) { }

    public start(): Promise<void> {
        console.log('ElectronApp is starting');
        return new Promise<void>((resolve: (() => void) | null) => {
            const createWindow = () => {
                this.mainWindow = new BrowserWindow({ width: 900, height: 700 });
                if (this.config.isDev) {
                    this.mainWindow.webContents.openDevTools();
                } else {
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

            app.on('ready', createWindow.bind(this));

            app.on('window-all-closed', () => {
                // On OS X it is common for applications and their menu bar
                // to stay active until the user quits explicitly with Cmd + Q
                if (process.platform !== 'darwin') {
                    app.quit();
                }
            });

            app.on('activate', () => {
                // On OS X it's common to re-create a window in the app when the
                // dock icon is clicked and there are no other windows open.
                if (!this.mainWindow) {
                    createWindow();
                }
            });
        });
    };
}