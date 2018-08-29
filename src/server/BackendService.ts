import { ElectronApp } from './ElectronApp';
import { ExpressApp } from './ExpressApp';

class BackendService {
    public electronApp: ElectronApp;
    public expressApp: ExpressApp;
    public root: string;
    public isDev: boolean;
    public port: number;

    public async start(root: string): Promise<void> {
        this.root = root;
        this.isDev = process.env.NODE_ENV !== 'production';
        this.port = this.isDev ? 5000 : 3000;

        console.log('BackendService is starting | NODE_ENV: ' + process.env.NODE_ENV + ' | port: ' + this.port + ' | root: ' + this.root);

        this.electronApp = new ElectronApp(this.port, this.isDev);
        await this.electronApp.start();

        this.expressApp = new ExpressApp(this.port, this.root);
        await this.expressApp.start();

        console.log('BackendService is running');
    }
}

export const instance = new BackendService();