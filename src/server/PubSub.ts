import * as Emitter from 'events';

export interface IPubSubEvgent {
    name: string;
    resolve: (data: any) => void;
    reject: (reason: any) => void;
}

export class PubSub {
    private __EMITTER__ = new Emitter();

    public subscribe(eventName: string, listener: (event: IPubSubEvgent, ...args: any[]) => void) {
        this.__EMITTER__.on(eventName, listener);
    }

    public once(eventName: string, listener: (event: IPubSubEvgent, ...args: any[]) => void) {
        this.__EMITTER__.once(eventName, listener);
    }

    public unsubscribe(eventName: string, listener: (event: IPubSubEvgent, ...args: any[]) => void) {
        this.__EMITTER__.removeListener(eventName, listener);
    }

    public publish(eventName: string, ...args: any[]) {
        return new Promise<any>((resolve, reject) => {
            const event = {
                name: eventName,
                resolve,
                reject,
            };

            this.__EMITTER__.emit(eventName, event, ...args);
        });
    }

    public clearAllSubscriptions() {
        this.__EMITTER__.removeAllListeners();
    }
}