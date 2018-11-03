import * as uuidv4 from 'uuid/v4';
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

    public createOrUpdate(item: IWebPageOptions): IWebPageOptions {
        const items = this.repository.store.list;
        const index = item.id ? items.findIndex(x => x.id === item.id) : -1;

        if (index >= 0) {
            items[index] = item;
        } else {
            if (!item.id) {
                item.id = 'WebPage_' + uuidv4(); // generate new ID
            }
            items.push(item);
        }

        this.repository.store = { list: items };
        this.topics.publish('pages-updated', this.repository.store);
        return item;
    }

    public remove(id: string): void {
        const items = this.repository.store.list;
        const index = items.findIndex(x => x.id === id);

        if (index >= 0) {
            items.splice(index);
        }

        this.repository.store = { list: items };
        this.topics.publish('pages-updated', this.repository.store);
    }
}
