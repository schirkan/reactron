"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var Store = require('electron-store');
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
    WebPageManager.prototype.createOrUpdate = function (page) {
        var items = this.repository.store.list;
        var id = items.findIndex(function (x) { return x.path === page.path; });
        if (id >= 0) {
            items[id] = page;
        }
        else {
            items.push(page);
        }
        this.repository.store = { list: items };
        this.topics.publish('pages-updated', this.repository.store);
    };
    WebPageManager.prototype.remove = function (path) {
        var items = this.repository.store.list;
        var id = items.findIndex(function (x) { return x.path === path; });
        if (id >= 0) {
            items.splice(id);
        }
        this.repository.store = { list: items };
        this.topics.publish('pages-updated', this.repository.store);
    };
    return WebPageManager;
}());
exports.WebPageManager = WebPageManager;
//# sourceMappingURL=WebPageManager.js.map