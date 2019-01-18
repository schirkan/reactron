import { IPubSub, IPubSubEvent, PubSubListener, topicNames } from '@schirkan/reactron-interfaces';
import * as Emitter from 'events';

export class PubSub implements IPubSub {
  private __EMITTER__ = new Emitter.EventEmitter();

  public subscribe(eventName: string, listener: PubSubListener) {
    console.log('subscribe: ' + eventName);
    this.__EMITTER__.on(eventName, listener);
  }

  public once(eventName: string, listener: PubSubListener) {
    this.__EMITTER__.once(eventName, listener);
  }

  public unsubscribe(eventName: string, listener: PubSubListener) {
    this.__EMITTER__.removeListener(eventName, listener);
  }

  public publish(eventName: string, ...args: any[]): void {
    if (eventName !== topicNames.log) {
      console.log('publish: ' + eventName, args);
    }
    const event: IPubSubEvent = { name: eventName };
    this.__EMITTER__.emit(eventName, event, ...args);
  }

  public clearAllSubscriptions() {
    this.__EMITTER__.removeAllListeners();
  }
}