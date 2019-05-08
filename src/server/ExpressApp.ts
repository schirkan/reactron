import { IBackendServiceConfig, IExpressApp } from '@schirkan/reactron-interfaces';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

export class ExpressApp implements IExpressApp {
  public express!: express.Application;
  public server!: http.Server;
  public apiRouter!: express.Router;
  public modulesRouter!: express.Router;

  constructor(private config: IBackendServiceConfig) { }

  public start(): Promise<void> {
    console.log('ExpressApp is starting');
    return new Promise<void>((resolve) => {
      this.express = express();

      // parse application/x-www-form-urlencoded
      this.express.use(express.urlencoded({ extended: false }));
      // parse application/json
      this.express.use(express.json());

      // api router
      this.apiRouter = express.Router();
      this.express.use('/api', this.apiRouter);

      // log api calls
      this.apiRouter.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log('Api call ' + req.method + ' ' + req.originalUrl, req.body);
        next();
      });

      // static files
      this.modulesRouter = express.Router();
      this.express.use('/modules', this.modulesRouter);
      this.express.use('/node_modules', express.static(this.config.nodeModulesPath)); // only for systemjs files
      const buildFolder = path.join(this.config.root, 'build');
      this.express.use('/', express.static(buildFolder));

      // for react router
      const indexFile = path.join(buildFolder, 'index.html');
      this.express.get('/*', (req: express.Request, res: express.Response) => {
        res.sendFile(indexFile, (err: any) => err && res.status(500).send(err));
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