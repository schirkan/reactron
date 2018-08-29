import * as express from 'express';
import * as http from 'http';

export class ExpressApp {
    public express: express.Application;
    public server: http.Server;

    constructor(private port: number, private root: string) { }

    public start() {
        // return new Promise<void>((resolve, reject) => {
            this.express = express();
            this.express.use('/modules', express.static(this.root + '/modules'));
            this.express.use('/node_modules', express.static(this.root + '/node_modules'));
            this.express.use('/', express.static(this.root + '/build'));
            this.server = this.express.listen(this.port, () => {
                console.log('ExpressApp listening on Port ' + this.port);
                // resolve();
            });
        // });
    }
}