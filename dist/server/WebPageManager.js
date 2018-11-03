"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var Store = require('electron-store');
// tslint:disable-next-line:no-var-requires
var uuidv4 = require('uuid/v4');
var WebPageManager = /** @class */ (function () {
    function WebPageManager(topics, defaultOptions) {
        this.topics = topics;
        this.repository = new Store({
            name: 'WebPageRepository',
            defaults: { list: defaultOptions || [] }
        });
    }
    WebPageManager.prototype.getAll = function () {
        return this.repository.store.list;
    };
    WebPageManager.prototype.createOrUpdate = function (item) {
        var items = this.repository.store.list;
        var index = item.id ? items.findIndex(function (x) { return x.id === item.id; }) : -1;
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
        this.topics.publish('pages-updated', this.repository.store);
        return item;
    };
    WebPageManager.prototype.remove = function (id) {
        var items = this.repository.store.list;
        var index = items.findIndex(function (x) { return x.id === id; });
        if (index >= 0) {
            items.splice(index);
        }
        this.repository.store = { list: items };
        this.topics.publish('pages-updated', this.repository.store);
    };
    return WebPageManager;
}());
exports.WebPageManager = WebPageManager;
//# sourceMappingURL=WebPageManager.js.map