"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reactron_interfaces_1 = require("@schirkan/reactron-interfaces");
// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');
class SystemSettingsManager {
    constructor(topics, defaultSettings) {
        this.topics = topics;
        this.repository = new Store({
            name: 'SystemSettings',
            defaults: defaultSettings
        });
    }
    get() {
        return this.repository.store;
    }
    set(settings) {
        this.repository.store = settings;
        this.topics.publish(reactron_interfaces_1.topicNames.systemSettingsUpdated, settings);
    }
}
exports.SystemSettingsManager = SystemSettingsManager;
//# sourceMappingURL=SystemSettingsManager.js.map