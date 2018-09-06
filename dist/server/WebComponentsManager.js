"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var Store = require('electron-store');
var WebComponentsManager = /** @class */ (function () {
    function WebComponentsManager(topics, defaultOptions) {
        this.topics = topics;
        this.repository = new Store({
            name: 'WebComponentsRepository',
            defaults: defaultOptions
        });
    }
    WebComponentsManager.prototype.getAll = function () {
        return this.repository.store;
    };
    WebComponentsManager.prototype.createOrUpdate = function (page) {
        var pages = this.repository.store;
        var index = pages.findIndex(function (x) { return x.id === page.id; });
        if (index >= 0) {
            pages[index] = page;
        }
        else {
            pages.push(page);
        }
        this.repository.store = pages;
        this.topics.publish('components-updated', this.repository.store);
    };
    WebComponentsManager.prototype.remove = function (id) {
        var pages = this.repository.store;
        var index = pages.findIndex(function (x) { return x.id === id; });
        if (index >= 0) {
            pages.splice(index);
        }
        this.repository.store = pages;
        this.topics.publish('components-updated', this.repository.store);
    };
    return WebComponentsManager;
}());
exports.WebComponentsManager = WebComponentsManager;
//# sourceMappingURL=WebComponentsManager.js.map