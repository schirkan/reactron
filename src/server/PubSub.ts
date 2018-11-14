import { IPubSub, IPubSubEvgent } from '@schirkan/reactron-interfaces';
import * as Emitter from 'events';

export class PubSub implements IPubSub {
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

    public publish(eventName: string, ...args: any[]): Promise<any> {
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