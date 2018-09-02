import { ISystemSettings } from "../interfaces/ISystemSettings";

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class SystemSettingsManager implements ISystemSettings {
    private store: ElectronStore<ISystemSettings> = new Store({
        name: 'SystemSettings',
        defaults: SystemSettingsManager.defaultSettings
    });

    public static readonly defaultSettings: ISystemSettings = {
        lang: 'de',
        location: '',
        theme: 'default',
        timezone: 'Europe/Berlin'
    };

    get lang(): string {
        return this.store.get('lang');
    }
    set lang(value: string) {
        this.store.set('lang', value);
    }

    get location(): string {
        return this.store.get('location');
    }
    set location(value: string) {
        this.store.set('location', value);
    }

    get timezone(): string {
        return this.store.get('timezone');
    }
    set timezone(value: string) {
        this.store.set('timezone', value);
    }

    get theme(): string {
        return this.store.get('theme');
    }
    set theme(value: string) {
        this.store.set('theme', value);
    }
}