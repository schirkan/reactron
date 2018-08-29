import { ElectronApp } from './ElectronApp';
import { ExpressApp } from './ExpressApp';

class BackendService {
    public electronApp: ElectronApp;
    public expressApp: ExpressApp;
    public root: string;
    public isDev: boolean;
    public frontendPort: number;
    public backendPort: number;

    public async start(root: string): Promise<void> {
        this.root = root;
        this.isDev = process.env.NODE_ENV !== 'production';
        this.backendPort = this.isDev ? 5000 : 3000;
        this.frontendPort = 3000;

        console.log('BackendService is starting | NODE_ENV: ' + process.env.NODE_ENV +
            ' | backendPort: ' + this.backendPort +
            ' | frontendPort: ' + this.frontendPort +
            ' | root: ' + this.root);

        this.expressApp = new ExpressApp(this.backendPort, this.root);
        this.expressApp.start();

        this.electronApp = new ElectronApp(this.frontendPort, this.isDev);
        this.electronApp.start();

        console.log('BackendService is running');
    }
}

export const instance = new BackendService();