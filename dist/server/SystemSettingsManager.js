"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var Store = require('electron-store');
var SystemSettingsManager = /** @class */ (function () {
    function SystemSettingsManager() {
        this.store = new Store({
            name: 'SystemSettings',
            defaults: SystemSettingsManager.defaultSettings
        });
    }
    Object.defineProperty(SystemSettingsManager.prototype, "lang", {
        get: function () {
            return this.store.get('lang');
        },
        set: function (value) {
            this.store.set('lang', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SystemSettingsManager.prototype, "location", {
        get: function () {
            return this.store.get('location');
        },
        set: function (value) {
            this.store.set('location', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SystemSettingsManager.prototype, "timezone", {
        get: function () {
            return this.store.get('timezone');
        },
        set: function (value) {
            this.store.set('timezone', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SystemSettingsManager.prototype, "theme", {
        get: function () {
            return this.store.get('theme');
        },
        set: function (value) {
            this.store.set('theme', value);
        },
        enumerable: true,
        configurable: true
    });
    SystemSettingsManager.defaultSettings = {
        lang: 'de',
        location: '',
        theme: 'default',
        timezone: 'Europe/Berlin'
    };
    return SystemSettingsManager;
}());
exports.SystemSettingsManager = SystemSettingsManager;
//# sourceMappingURL=SystemSettingsManager.js.map