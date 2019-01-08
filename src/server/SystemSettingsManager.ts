import { IPubSub, ISettingsManager, ISystemSettings } from "@schirkan/reactron-interfaces";
import { topicNames } from "../common/topics";

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class SystemSettingsManager implements ISettingsManager {
    private repository: ElectronStore<ISystemSettings>

    constructor(private topics: IPubSub, defaultSettings: ISystemSettings) {
        this.repository = new Store({
            name: 'SystemSettings',
            defaults: defaultSettings
        });
    }

    public get(): ISystemSettings {
        return this.repository.store;
    }

    public set(settings: ISystemSettings) {
        this.repository.store = settings;
        this.topics.publish(topicNames.systemSettingsUpdated, settings);
    }
}