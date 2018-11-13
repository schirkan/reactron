/// <reference types="node" />
import * as express from 'express';
import * as http from 'http';
import { IBackendServiceConfig } from '../interfaces/IBackendServiceConfig';
export declare class ExpressApp {
    private config;
    express: express.Application;
    server: http.Server;
    apiRouter: express.Router;
    constructor(config: IBackendServiceConfig);
    start(): Promise<void>;
    registerErrorHandler(): void;
}
