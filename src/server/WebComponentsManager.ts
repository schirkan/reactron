import { IPubSub } from "../interfaces/IPubSub";
import { IWebComponentOptions } from "../interfaces/IWebComponentOptions";

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class WebComponentsManager {
    private repository: ElectronStore<IWebComponentOptions[]>

    constructor(private topics: IPubSub, defaultOptions: IWebComponentOptions[]) {
        this.repository = new Store({
            name: 'WebComponentsRepository',
            defaults: defaultOptions
        });
    }

    public getAll(){
        return this.repository.store;
    }

    public createOrUpdate(page: IWebComponentOptions): void {
        const pages = this.repository.store;
        const index = pages.findIndex(x => x.id === page.id);

        if (index >= 0) {
            pages[index] = page;
        } else {
            pages.push(page);
        }

        this.repository.store = pages;
        this.topics.publish('components-updated', this.repository.store);
    }

    public remove(id: string): void {
        const pages = this.repository.store;
        const index = pages.findIndex(x => x.id === id);

        if (index >= 0) {
            pages.splice(index);
        }

        this.repository.store = pages;
        this.topics.publish('components-updated', this.repository.store);
    }
}
