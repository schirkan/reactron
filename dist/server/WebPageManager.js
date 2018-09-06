"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var Store = require('electron-store');
var WebPageManager = /** @class */ (function () {
    function WebPageManager(topics, defaultOptions) {
        this.topics = topics;
        this.repository = new Store({
            name: 'WebPageRepository',
            defaults: defaultOptions
        });
    }
    WebPageManager.prototype.getAll = function () {
        return this.repository.store;
    };
    WebPageManager.prototype.createOrUpdate = function (page) {
        var pages = this.repository.store;
        var id = pages.findIndex(function (x) { return x.path === page.path; });
        if (id >= 0) {
            pages[id] = page;
        }
        else {
            pages.push(page);
        }
        this.repository.store = pages;
        this.topics.publish('pages-updated', this.repository.store);
    };
    WebPageManager.prototype.remove = function (path) {
        var pages = this.repository.store;
        var id = pages.findIndex(function (x) { return x.path === path; });
        if (id >= 0) {
            pages.splice(id);
        }
        this.repository.store = pages;
        this.topics.publish('pages-updated', this.repository.store);
    };
    return WebPageManager;
}());
exports.WebPageManager = WebPageManager;
//# sourceMappingURL=WebPageManager.js.map