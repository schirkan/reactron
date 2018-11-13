import { IPubSub } from "../interfaces/IPubSub";
import { IWebComponentOptions } from "../interfaces/IWebComponentOptions";
export declare class WebComponentsManager {
    private topics;
    private repository;
    constructor(topics: IPubSub, defaultOptions: IWebComponentOptions[]);
    getAll(): IWebComponentOptions[];
    createOrUpdate(item: IWebComponentOptions): IWebComponentOptions;
    remove(id: string): void;
}
