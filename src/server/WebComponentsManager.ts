import { IPubSub, IWebComponentOptions, IWebComponentsManager } from "@schirkan/reactron-interfaces";
import * as uuidv4 from 'uuid/v4';
import { topicNames } from "../common/topics";

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class WebComponentsManager implements IWebComponentsManager {
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

    public createOrUpdate(item: IWebComponentOptions): IWebComponentOptions {
        const items = this.repository.store.list;
        const index = item.id ? items.findIndex(x => x.id === item.id) : -1;

        if (index >= 0) {
            items[index] = item;
        } else {
            if (!item.id) {
                item.id = 'WebComponent_' + uuidv4(); // generate new ID
            }
            items.push(item);
        }

        this.repository.store = { list: items };
        this.topics.publish(topicNames.componentsUpdated, this.repository.store.list);
        return item;
    }

    public remove(id: string): void {
        this.removeRecursive(id);
        this.topics.publish(topicNames.componentsUpdated, this.repository.store.list);
    }

    private removeRecursive(id: string): void {
        let items = this.repository.store.list;
        const children = items.filter(x => x.parentId === id);
        items = items.filter(x => x.id !== id);
        this.repository.store = { list: items };
        children.forEach(child => this.removeRecursive(child.id));
    }
}
