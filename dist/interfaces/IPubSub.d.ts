export interface IPubSubEvgent {
    name: string;
    resolve: (data: any) => void;
    reject: (reason: any) => void;
}
export interface IPubSub {
    subscribe(eventName: string, listener: (event: IPubSubEvgent, ...args: any[]) => void): void;
    once(eventName: string, listener: (event: IPubSubEvgent, ...args: any[]) => void): void;
    unsubscribe(eventName: string, listener: (event: IPubSubEvgent, ...args: any[]) => void): void;
    publish(eventName: string, ...args: any[]): Promise<any>;
    clearAllSubscriptions(): void;
}
