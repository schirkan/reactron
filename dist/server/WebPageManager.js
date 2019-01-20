"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reactron_interfaces_1 = require("@schirkan/reactron-interfaces");
const uuidv4 = require("uuid/v4");
// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');
class WebPageManager {
    constructor(topics, defaultOptions) {
        this.topics = topics;
        this.repository = new Store({
            name: 'WebPageRepository',
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
                item.id = 'WebPage_' + uuidv4(); // generate new ID
            }
            items.push(item);
        }
        this.repository.store = { list: items };
        this.topics.publish(reactron_interfaces_1.topicNames.pagesUpdated, this.repository.store);
        return item;
    }
    remove(id) {
        const items = this.repository.store.list;
        const index = items.findIndex(x => x.id === id);
        if (index >= 0) {
            items.splice(index, 1);
        }
        this.repository.store = { list: items };
        this.topics.publish(reactron_interfaces_1.topicNames.pagesUpdated, this.repository.store);
    }
}
exports.WebPageManager = WebPageManager;
//# sourceMappingURL=WebPageManager.js.map