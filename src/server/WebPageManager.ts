import { IPubSub } from "../interfaces/IPubSub";
import { IWebPageOptions } from "../interfaces/IWebPageOptions";

// tslint:disable-next-line:no-var-requires
const Store = require('electron-store');

export class WebPageManager {
    private repository: ElectronStore<IWebPageOptions[]>

    constructor(private topics: IPubSub, defaultOptions: IWebPageOptions[]) {
        this.repository = new Store({
            name: 'WebPageRepository',
            defaults: defaultOptions
        });
    }

    public getAll(){
        return this.repository.store;
    }

    public createOrUpdate(page: IWebPageOptions): void {
        const pages = this.repository.store;
        const id = pages.findIndex(x => x.path === page.path);

        if (id >= 0) {
            pages[id] = page;
        } else {
            pages.push(page);
        }

        this.repository.store = pages;
        this.topics.publish('pages-updated', this.repository.store);
    }

    public remove(path: string): void {
        const pages = this.repository.store;
        const id = pages.findIndex(x => x.path === path);

        if (id >= 0) {
            pages.splice(id);
        }

        this.repository.store = pages;
        this.topics.publish('pages-updated', this.repository.store);
    }
}
