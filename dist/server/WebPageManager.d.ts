import { IPubSub } from "../interfaces/IPubSub";
import { IWebPageOptions } from "../interfaces/IWebPageOptions";
export declare class WebPageManager {
    private topics;
    private repository;
    constructor(topics: IPubSub, defaultOptions: IWebPageOptions[]);
    getAll(): IWebPageOptions[];
    createOrUpdate(item: IWebPageOptions): IWebPageOptions;
    remove(id: string): void;
}
