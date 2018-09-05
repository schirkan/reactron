"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var Store = require('electron-store');
var DashboardManager = /** @class */ (function () {
    function DashboardManager(topics, defaultDashboardOptions) {
        this.topics = topics;
        this.optionsRepository = new Store({
            name: 'DashboardOptionsRepository',
            defaults: defaultDashboardOptions
        });
    }
    DashboardManager.prototype.getOptions = function () {
        return this.optionsRepository.store;
    };
    DashboardManager.prototype.setLayout = function (layout) {
        this.optionsRepository.set('layout', layout);
        this.topics.publish('dashboard-updated', this.optionsRepository.store);
    };
    DashboardManager.prototype.setTile = function (tile) {
        var tiles = this.optionsRepository.get('tiles');
        var existingTileIndex = tiles.findIndex(function (x) { return x.id === tile.id; });
        if (existingTileIndex >= 0) {
            tiles[existingTileIndex] = tile;
        }
        else {
            tiles.push(tile);
        }
        this.optionsRepository.set('tiles', tiles);
        this.topics.publish('dashboard-updated', this.optionsRepository.store);
    };
    DashboardManager.prototype.removeTile = function (tileId) {
        var tiles = this.optionsRepository.get('tiles');
        var existingTileIndex = tiles.findIndex(function (x) { return x.id === tileId; });
        if (existingTileIndex >= 0) {
            tiles.splice(existingTileIndex);
        }
        this.optionsRepository.set('tiles', tiles);
        this.topics.publish('dashboard-updated', this.optionsRepository.store);
    };
    return DashboardManager;
}());
exports.DashboardManager = DashboardManager;
//# sourceMappingURL=DashboardManager.js.map