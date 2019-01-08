"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuidv4 = require("uuid/v4");
var topics_1 = require("../common/topics");
// tslint:disable-next-line:no-var-requires
var Store = require('electron-store');
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
            if (!item.id) {
                item.id = 'WebComponent_' + uuidv4(); // generate new ID
            }
            items.push(item);
        }
        this.repository.store = { list: items };
        this.topics.publish(topics_1.topicNames.componentsUpdated, this.repository.store.list);
        return item;
    };
    WebComponentsManager.prototype.remove = function (id) {
        this.removeRecursive(id);
        this.topics.publish(topics_1.topicNames.componentsUpdated, this.repository.store.list);
    };
    WebComponentsManager.prototype.removeRecursive = function (id) {
        var _this = this;
        var items = this.repository.store.list;
        var children = items.filter(function (x) { return x.parentId === id; });
        items = items.filter(function (x) { return x.id !== id; });
        this.repository.store = { list: items };
        children.forEach(function (child) { return _this.removeRecursive(child.id); });
    };
    return WebComponentsManager;
}());
exports.WebComponentsManager = WebComponentsManager;
//# sourceMappingURL=WebComponentsManager.js.map