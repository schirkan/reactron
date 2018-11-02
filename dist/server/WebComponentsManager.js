"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var Store = require('electron-store');
// tslint:disable-next-line:no-var-requires
var uuidv4 = require('uuid/v4');
var WebComponentsManager = /** @class */ (function () {
    function WebComponentsManager(topics, defaultOptions) {
        this.topics = topics;
        this.repository = new Store({
            name: 'WebComponentsRepository',
            defaults: { list: defaultOptions || [] }
        });
    }
    WebComponentsManager.prototype.getAll = function () {
        return this.repository.store.list;
    };
    WebComponentsManager.prototype.createOrUpdate = function (item) {
        var items = this.repository.store.list;
        var index = item.id ? items.findIndex(function (x) { return x.id === item.id; }) : -1;
        if (index >= 0) {
            items[index] = item;
        }
        else {
            item.id = 'WebComponent_' + uuidv4(); // generate new ID
            items.push(item);
        }
        this.repository.store = { list: items };
        this.topics.publish('components-updated', this.repository.store);
        return item;
    };
    WebComponentsManager.prototype.remove = function (id) {
        var items = this.repository.store.list;
        var index = items.findIndex(function (x) { return x.id === id; });
        if (index >= 0) {
            items.splice(index);
        }
        this.repository.store = { list: items };
        this.topics.publish('components-updated', this.repository.store);
    };
    return WebComponentsManager;
}());
exports.WebComponentsManager = WebComponentsManager;
//# sourceMappingURL=WebComponentsManager.js.map