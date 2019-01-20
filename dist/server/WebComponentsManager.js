"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reactron_interfaces_1 = require("@schirkan/reactron-interfaces");
const uuidv4 = require("uuid/v4");
// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');
class WebComponentsManager {
    constructor(topics, defaultOptions) {
        this.topics = topics;
        this.repository = new Store({
            name: 'WebComponentsRepository',
            defaults: { list: defaultOptions || [] }
        });
    }
    getAll() {
        return this.repository.store.list;
    }
    createOrUpdate(item) {
        const items = this.repository.store.list;
        const index = item.id ? items.findIndex(x => x.id === item.id) : -1;
        if (index >= 0) {
            items[index] = item;
        }
        else {
            if (!item.id) {
                item.id = 'WebComponent_' + uuidv4(); // generate new ID
            }
            items.push(item);
        }
        this.repository.store = { list: items };
        this.topics.publish(reactron_interfaces_1.topicNames.componentsUpdated, this.repository.store.list);
        return item;
    }
    remove(id) {
        this.removeRecursive(id);
        this.topics.publish(reactron_interfaces_1.topicNames.componentsUpdated, this.repository.store.list);
    }
    removeRecursive(id) {
        let items = this.repository.store.list;
        const children = items.filter(x => x.parentId === id);
        items = items.filter(x => x.id !== id);
        this.repository.store = { list: items };
        children.forEach(child => this.removeRecursive(child.id));
    }
}
exports.WebComponentsManager = WebComponentsManager;
//# sourceMappingURL=WebComponentsManager.js.map