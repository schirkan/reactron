import { IReactronService, topicNames, IReactronServiceContext } from '@schirkan/reactron-interfaces';

export class RefreshController implements IReactronService {
  private timer?: any;

  constructor(private context: IReactronServiceContext) {
    this.restart = this.restart.bind(this);
    this.onTimer = this.onTimer.bind(this);
  }

  public async start(): Promise<void> {
    // subscribe to settings changes
    this.context.topics.subscribe(topicNames.systemSettingsUpdated, this.restart);
    this.startAutoRefresh();
  }

  public async stop() {
    this.context.topics.unsubscribe(topicNames.systemSettingsUpdated, this.restart);
    this.stopAutoRefresh();
  }

  private onTimer() {
    this.context.log.debug('onTimer');
    clearTimeout(this.timer);
    this.context.topics.publish(topicNames.refresh);
    this.setNextTimer();
  }

  private setNextTimer() {
    const now = new Date();
    const timeInMinutes = (now.getHours() * 60) + now.getMinutes();
    const timestamp = now.getTime();
    const timestampToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    let nextRefreshTimestamp = 0;

    this.context.settings.autorefresh.forEach(item => {
      let tempNextRefreshTimestamp: number = 0;
      if (this.isInInterval(timeInMinutes, +item.from, +item.to)) {
        tempNextRefreshTimestamp = timestamp + (item.interval * 60 * 1000);
      } else {
        tempNextRefreshTimestamp = timestampToday + (+item.from * 60 * 1000);
      }
      if (nextRefreshTimestamp === 0 || (tempNextRefreshTimestamp > 0 && tempNextRefreshTimestamp < nextRefreshTimestamp)) {
        nextRefreshTimestamp = tempNextRefreshTimestamp;
      }
    });

    if (nextRefreshTimestamp > 0) {
      const timeout = nextRefreshTimestamp - timestamp;
      this.timer = setTimeout(this.onTimer, timeout);
    }
  }

  private isInInterval(value: number, from: number, to: number) {
    if (from === to) {
      return false;
    } else if (from < to) {
      if (value >= from && value <= to) {
        return true;
      }
    } else {
      if (value >= from || value <= to) {
        return true;
      }
    }
    return false;
  }

  private restart() {
    this.stopAutoRefresh();
    this.startAutoRefresh();
  }

  private startAutoRefresh() {
    this.context.log.debug('startAutoRefresh');
    if (this.timer) {
      return;
    }
    this.setNextTimer();
  }

  private stopAutoRefresh() {
    this.context.log.debug('stopAutoRefresh');
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}