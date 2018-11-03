import * as React from "react";
import { apiClient } from "src/browser/ApiClient";
import { IWebComponentOptions } from "src/interfaces/IWebComponentOptions";
import { SimpleEvent } from "./SimpleEvent";

export class OptionsCardContextData {
    public onSave = new SimpleEvent();
    // public onValidate = new SimpleEvent();
    private removedWebComponents: IWebComponentOptions[] = [];
    private changedWebComponents: IWebComponentOptions[] = [];
    private createdWebComponents: IWebComponentOptions[] = [];

    constructor() {
        this.saveWebComponents = this.saveWebComponents.bind(this);
        this.onSave.subscribe(this.saveWebComponents);
    }

    private async saveWebComponents(): Promise<void> {
        console.log('removedWebComponents', this.removedWebComponents);
        console.log('createdWebComponents', this.createdWebComponents);
        console.log('changedWebComponents', this.changedWebComponents);

        // delete webComponents
        for (const item of this.removedWebComponents) {
            await apiClient.deleteWebComponentOptions(item);
        }

        // add webComponents
        for (const item of this.createdWebComponents) {
            await apiClient.setWebComponentOptions(undefined, item);
        }

        // change webComponents
        for (const item of this.changedWebComponents) {
            await apiClient.setWebComponentOptions(undefined, item);
        }

        // reset context
        this.removedWebComponents = [];
        this.changedWebComponents = [];
        this.createdWebComponents = [];
    }

    public webComponentRemoved(item: IWebComponentOptions) {
        console.log('webComponentRemoved', item);

        // check if previously created
        const createdItemIndex = this.createdWebComponents.findIndex(x => x.id === item.id);
        if (createdItemIndex >= 0) {
            // remove from createdWebComponents
            this.createdWebComponents.splice(createdItemIndex, 1);
        } else {
            // add to removedWebComponents
            this.removedWebComponents.push(item);
        }
    }

    public webComponentChanged(item: IWebComponentOptions) {
        console.log('webComponentChanged', item);

        // check if previously created
        const createdItemIndex = this.createdWebComponents.findIndex(x => x.id === item.id);
        if (createdItemIndex >= 0) {
            // remove old item from createdWebComponents
            this.createdWebComponents.splice(createdItemIndex, 1);
            // and add new item to createdWebComponents
            this.changedWebComponents.push(item);
        } else {
            // remove previously changed items
            this.createdWebComponents = this.createdWebComponents.filter(x => x.id !== item.id);
            // add to changedWebComponents
            this.changedWebComponents.push(item);
        }
    }

    public webComponentCreated(item: IWebComponentOptions) {
        console.log('webComponentCreated', item);

        // add to createdWebComponents
        this.createdWebComponents.push(item);
    }
}

export const OptionCardContext = React.createContext<OptionsCardContextData>(new OptionsCardContextData());