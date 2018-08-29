import { app, BrowserWindow } from "electron";

export class ElectronApp {
    public mainWindow: Electron.BrowserWindow;

    constructor(private port: number, private isDev: boolean) { }

    private createWindow() {
        this.mainWindow = new BrowserWindow({ width: 900, height: 700 });
        this.mainWindow.setFullScreen(true);
        this.mainWindow.loadURL('http://localhost:' + this.port);
        console.log('ElectronApp.start()', { port: this.port, isDev: this.isDev });
        if (this.isDev) {
            this.mainWindow.webContents.openDevTools();
        }
        this.mainWindow.on('closed', () => {
            delete (this.mainWindow);
        })
    }

    public start() {
        app.on('ready', this.createWindow.bind(this));

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
                this.createWindow();
            }
        });
    };
}