"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
class ExpressApp {
    constructor(config) {
        this.config = config;
    }
    start() {
        console.log('ExpressApp is starting');
        return new Promise((resolve) => {
            this.express = express();
            // parse application/x-www-form-urlencoded
            this.express.use(express.urlencoded({ extended: false }));
            // parse application/json
            this.express.use(express.json());
            // api router
            this.apiRouter = express.Router();
            this.express.use('/api', this.apiRouter);
            // log api calls
            this.apiRouter.use((req, res, next) => {
                console.log('Api call ' + req.method + ' ' + req.originalUrl, req.body);
                next();
            });
            // static files
            const buildFolder = path.join(this.config.root, 'build');
            const indexFile = path.join(buildFolder, 'index.html');
            this.express.use('/modules', express.static(this.config.modulesRootPath));
            this.express.use('/node_modules', express.static(this.config.nodeModulesPath)); // only for systemjs files
            this.express.use('/', express.static(buildFolder));
            // for react router
            this.express.get('/*', (req, res) => {
                res.sendFile(indexFile, (err) => err && res.status(500).send(err));
            });
            // start listening
            this.server = this.express.listen(this.config.backendPort, () => {
                console.log('ExpressApp is listening on Port ' + this.config.backendPort);
                resolve();
            });
        });
    }
    registerErrorHandler() {
        this.apiRouter.use((err, req, res, next) => {
            res.status(500).send(err);
        });
        this.express.use((err, req, res, next) => {
            res.status(500).send(err);
        });
    }
}
exports.ExpressApp = ExpressApp;
//# sourceMappingURL=ExpressApp.js.map