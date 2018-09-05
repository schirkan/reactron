import { IDashboardLayout, IDashboardOptions, IDashboardTile } from "../interfaces/IDashboardOptions";
import { IPubSub } from "../interfaces/IPubSub";

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class DashboardManager {
    private optionsRepository: ElectronStore<IDashboardOptions>

    constructor(private topics: IPubSub, defaultDashboardOptions: IDashboardOptions) {
        this.optionsRepository = new Store({
            name: 'DashboardOptionsRepository',
            defaults: defaultDashboardOptions
        });
    }

    public getOptions(): IDashboardOptions {
        return this.optionsRepository.store;
    }

    public setLayout(layout: IDashboardLayout): void {
        this.optionsRepository.set('layout', layout);
        this.topics.publish('dashboard-updated', this.optionsRepository.store);
    }

    public setTile(tile: IDashboardTile): void {
        const tiles = this.optionsRepository.get('tiles');
        const existingTileIndex = tiles.findIndex(x => x.id === tile.id);

        if (existingTileIndex >= 0) {
            tiles[existingTileIndex] = tile;
        } else {
            tiles.push(tile);
        }

        this.optionsRepository.set('tiles', tiles);
        this.topics.publish('dashboard-updated', this.optionsRepository.store);
    }

    public removeTile(tileId: string): void {
        const tiles = this.optionsRepository.get('tiles');
        const existingTileIndex = tiles.findIndex(x => x.id === tileId);

        if (existingTileIndex >= 0) {
            tiles.splice(existingTileIndex);
        }

        this.optionsRepository.set('tiles', tiles);
        this.topics.publish('dashboard-updated', this.optionsRepository.store);
    }
}
