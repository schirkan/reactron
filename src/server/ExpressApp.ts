import { IBackendServiceConfig, IExpressApp } from '@schirkan/reactron-interfaces';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

export class ExpressApp implements IExpressApp {
    public express!: express.Application;
    public server!: http.Server;
    public apiRouter!: express.Router;

    constructor(private config: IBackendServiceConfig) { }

    public start(): Promise<void> {
        console.log('ExpressApp is starting');
        return new Promise<void>((resolve) => {
            this.express = express();

            // parse application/x-www-form-urlencoded
            this.express.use(express.urlencoded({ extended: false }));
            // parse application/json
            this.express.use(express.json());

            this.apiRouter = express.Router();
            // log calls
            this.apiRouter.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
                console.log('Api call ' + req.method + ' ' + req.originalUrl, req.body);
                next();
            });

            this.express.use('/api', this.apiRouter);
            this.express.use('/modules', express.static(this.config.root + '/modules/node_modules'));
            this.express.use('/node_modules', express.static(this.config.root + '/node_modules'));
            this.express.use('/', express.static(this.config.root + '/build'));

            // for react router
            this.express.get('/*', (req: express.Request, res: express.Response) => {
                res.sendFile(path.join(this.config.root + '/build/index.html'), (err: any) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                })
            })

            // start listening
            this.server = this.express.listen(this.config.backendPort, () => {
                console.log('ExpressApp is listening on Port ' + this.config.backendPort);
                resolve();
            });
        });
    }

    public registerErrorHandler() {
        this.apiRouter.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(500).send(err);
        });
        this.express.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(500).send(err);
        });
    }
}