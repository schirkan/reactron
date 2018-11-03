type Callback<TData> = (data?: TData) => any;

export class SimpleEvent<TData = undefined> {
    private subscriptions: Array<Callback<TData>> = [];

    public subscribe(callback: Callback<TData>) {
        this.subscriptions.push(callback);
    }

    public unsubscribe(callback: Callback<TData>) {
        const index = this.subscriptions.indexOf(callback);
        if (index >= 0) {
            this.subscriptions.splice(index);
        }
    }

    public async publish(data?: TData): Promise<void> {
        for (const sub of this.subscriptions) {
            await Promise.resolve(sub(data));
        }
    }
}