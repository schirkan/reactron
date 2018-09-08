"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    WebComponentsManager.prototype.createOrUpdate = function (page) {
        var items = this.repository.store.list;
        var index = items.findIndex(function (x) { return x.id === page.id; });
        if (index >= 0) {
            items[index] = page;
        }
        else {
            items.push(page);
        }
        this.repository.store = { list: items };
        this.topics.publish('components-updated', this.repository.store);
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