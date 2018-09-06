import { IWebComponentOptions } from "./IWebComponentOptions";

export interface IWebPageOptions {
    path: string;
    title: string;
    content: IWebComponentOptions | string; // string für die ID
}