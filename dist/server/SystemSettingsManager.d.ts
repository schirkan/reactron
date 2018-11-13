import { IPubSub } from "../interfaces/IPubSub";
export declare class SystemSettingsManager<TSettings> {
    private topics;
    private repository;
    constructor(topics: IPubSub, defaultSettings: TSettings);
    get(): TSettings;
    set(settings: TSettings): void;
}
