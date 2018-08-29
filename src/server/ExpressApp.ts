import * as express from 'express';
import * as http from 'http';
import { IBackendServiceConfig } from './IBackendServiceConfig';

export class ExpressApp {
    public express: express.Application;
    public server: http.Server;
    public apiRouter: express.Router;

    constructor(private config: IBackendServiceConfig) { }

    public start() {
        console.log('ExpressApp is starting');
        return new Promise<void>((resolve, reject) => {
            this.express = express();
            this.apiRouter = express.Router();
            this.express.use('/api', this.apiRouter);
            this.express.use('/modules', express.static(this.config.root + '/modules'));
            this.express.use('/node_modules', express.static(this.config.root + '/node_modules'));
            this.express.use('/', express.static(this.config.root + '/build'));
            this.server = this.express.listen(this.config.backendPort, () => {
                console.log('ExpressApp is listening on Port ' + this.config.backendPort);
                resolve();
            });
        });
    }
}