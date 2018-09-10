import { IModuleRepositoryItem } from '../interfaces/IModuleRepositoryItem';
import { IWebComponentOptions } from '../interfaces/IWebComponentOptions';
import { IWebPageOptions } from '../interfaces/IWebPageOptions';
import { BrowserModuleHelper } from './BrowserModuleHelper';

const inernalModuleHelper = new BrowserModuleHelper('internal');

export class ApiClient {
    private modules: IModuleRepositoryItem[];
    private webPages: IWebPageOptions[];
    private webComponents: IWebComponentOptions[];

    public clearCache(){
        delete (this.modules);
        delete (this.webPages);
        delete (this.webComponents);
    }

    public async getModules(): Promise<IModuleRepositoryItem[]> {
        if (!this.modules) {
            const response = await fetch(inernalModuleHelper.moduleApiPath + '/modules');
            this.modules = await response.json();
        }
        return this.modules;
    }

    public async getWebPages(): Promise<IWebPageOptions[]> {
        if (!this.webPages) {
            const response = await fetch(inernalModuleHelper.moduleApiPath + '/pages');
            this.webPages = await response.json();
        }
        return this.webPages;
    }

    public async setWebPage(options: IWebPageOptions): Promise<void> {
        await fetch(inernalModuleHelper.moduleApiPath + '/pages', {
            method: 'post',
            body: JSON.stringify(options)
        });
    }

    public async deleteWebPage(path: string): Promise<void> {
        await fetch(inernalModuleHelper.moduleApiPath + '/' + path, {
            method: 'delete'
        });
    }

    public async getWebComponentOptions(): Promise<IWebComponentOptions[]> {
        if (!this.webComponents) {
            const response = await fetch(inernalModuleHelper.moduleApiPath + '/components');
            this.webComponents = await response.json();
        }
        return this.webComponents;
    }

    public async setWebComponentOptions(options: IWebComponentOptions): Promise<void> {
        await fetch(inernalModuleHelper.moduleApiPath + '/components', {
            method: 'post',
            body: JSON.stringify(options)
        });
    }

    public async deleteWebComponentOptions(id: string): Promise<void> {
        await fetch(inernalModuleHelper.moduleApiPath + '/' + id, {
            method: 'delete'
        });
    }
}

export const instance = new ApiClient();