import { IPubSub } from "../interfaces/IPubSub";

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class SystemSettingsManager<TSettings> {
    private repository: ElectronStore<TSettings>

    constructor(private topics: IPubSub, defaultSettings: TSettings) {
        this.repository = new Store({
            name: 'SystemSettings',
            defaults: defaultSettings
        });
    }

    public get(): TSettings {
        return this.repository.store;
    }

    public set(settings: TSettings) {
        this.repository.store = settings;
        this.topics.publish('system-settings-updated', settings);
    }
}