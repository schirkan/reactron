import { IBackendServiceConfig, IElectronApp } from '@schirkan/reactron-interfaces';
import { app, BrowserWindow, screen } from "electron";
import { node } from 'prop-types';

export class ElectronApp implements IElectronApp {
    public mainWindow!: Electron.BrowserWindow;

    constructor(private config: IBackendServiceConfig) { }

    public start(): Promise<void> {
        console.log('ElectronApp is starting');
        return new Promise<void>((resolve: (() => void) | null) => {
            const createWindow = () => {
                const mainScreen = screen.getPrimaryDisplay();

                this.mainWindow = new BrowserWindow({ width: mainScreen.size.width * 0.9, height: 700 });
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
            
            if (process.env.NODE_ENV === 'development') {
                const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
                installExtension(REACT_DEVELOPER_TOOLS)
                    .then((name: string) => console.log(`Added Extension:  ${name}`))
                    .catch((err: any) => console.log('An error occurred: ', err));
            }

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