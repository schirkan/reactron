import { IPubSub, IPubSubEvgent } from '../interfaces/IPubSub';
export declare class PubSub implements IPubSub {
    private __EMITTER__;
    subscribe(eventName: string, listener: (event: IPubSubEvgent, ...args: any[]) => void): void;
    once(eventName: string, listener: (event: IPubSubEvgent, ...args: any[]) => void): void;
    unsubscribe(eventName: string, listener: (event: IPubSubEvgent, ...args: any[]) => void): void;
    publish(eventName: string, ...args: any[]): Promise<any>;
    clearAllSubscriptions(): void;
}
