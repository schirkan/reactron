import { IPubSub } from "../interfaces/IPubSub";
import { IWebComponentOptions } from "../interfaces/IWebComponentOptions";

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

// tslint:disable-next-line:no-var-requires
const uuidv4 = require('uuid/v4');

export class WebComponentsManager {
    private repository: ElectronStore<{ list: IWebComponentOptions[] }>

    constructor(private topics: IPubSub, defaultOptions: IWebComponentOptions[]) {
        this.repository = new Store({
            name: 'WebComponentsRepository',
            defaults: { list: defaultOptions || [] }
        });
    }

    public getAll(): IWebComponentOptions[] {
        return this.repository.store.list;
    }

    public createOrUpdate(item: IWebComponentOptions): void {
        const items = this.repository.store.list;
        const index = item.id ? items.findIndex(x => x.id === item.id) : -1;

        if (index >= 0) {
            items[index] = item;
        } else {
            item.id = uuidv4(); // generate new ID
            items.push(item);
        }

        this.repository.store =  { list: items };
        this.topics.publish('components-updated', this.repository.store);
    }

    public remove(id: string): void {
        const items = this.repository.store.list;
        const index = items.findIndex(x => x.id === id);

        if (index >= 0) {
            items.splice(index);
        }

        this.repository.store = { list: items };
        this.topics.publish('components-updated', this.repository.store);
    }
}
