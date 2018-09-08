import { IPubSub } from "../interfaces/IPubSub";
import { IWebPageOptions } from "../interfaces/IWebPageOptions";

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class WebPageManager {
    private repository: ElectronStore<{ list: IWebPageOptions[] }>

    constructor(private topics: IPubSub, defaultOptions: IWebPageOptions[]) {
        this.repository = new Store({
            name: 'WebPageRepository',
            defaults: { list: defaultOptions || [] }
        });
    }

    public getAll(): IWebPageOptions[] {
        return this.repository.store.list;
    }

    public createOrUpdate(page: IWebPageOptions): void {
        const items = this.repository.store.list;
        const id = items.findIndex(x => x.path === page.path);

        if (id >= 0) {
            items[id] = page;
        } else {
            items.push(page);
        }

        this.repository.store = { list: items };
        this.topics.publish('pages-updated', this.repository.store);
    }

    public remove(path: string): void {
        const items = this.repository.store.list;
        const id = items.findIndex(x => x.path === path);

        if (id >= 0) {
            items.splice(id);
        }

        this.repository.store = { list: items };
        this.topics.publish('pages-updated', this.repository.store);
    }
}
