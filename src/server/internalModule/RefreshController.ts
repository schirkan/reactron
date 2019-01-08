import { IReactronService } from '@schirkan/reactron-interfaces';
import { topicNames } from '../../common/topics';
import { ReactronServiceContext } from '../ReactronServiceContext';

export class RefreshController implements IReactronService {
  private context!: ReactronServiceContext;
  private timer?: number;

  constructor() {
    this.restart = this.restart.bind(this);
    this.onTimer = this.onTimer.bind(this);
  }

  public async start(context: ReactronServiceContext): Promise<void> {
    console.log('RefreshController.start');

    this.context = context;

    // subscribe to settings changes
    this.context.backendService.topics.subscribe(topicNames.systemSettingsUpdated, this.restart);

    this.startAutoRefresh();
  }

  public async stop() {
    this.context.backendService.topics.unsubscribe(topicNames.systemSettingsUpdated, this.restart);
    this.stopAutoRefresh();
  }

  private onTimer() {
    console.log('RefreshController.onTimer');
    clearTimeout(this.timer);
    this.context.backendService.topics.publish(topicNames.refresh);
    this.setNextTimer();
  }

  private setNextTimer() {
    const now = new Date();
    const timeInMinutes = (now.getHours() * 60) + now.getMinutes();
    const timestamp = now.getTime();
    const timestampToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    let nextRefreshTimestamp = 0;

    this.context.settings.autorefresh.forEach(item => {
      let tempNextRefreshTimestamp: number;
      if (this.isInInterval(timeInMinutes, item.from, item.to)) {
        tempNextRefreshTimestamp = timestamp + (item.interval * 60 * 1000);
      } else {
        tempNextRefreshTimestamp = timestampToday + (item.from * 60 * 1000);
      }
      if (nextRefreshTimestamp === 0 || tempNextRefreshTimestamp < nextRefreshTimestamp) {
        nextRefreshTimestamp = tempNextRefreshTimestamp;
      }
    });

    if (nextRefreshTimestamp > 0) {
      const timeout = nextRefreshTimestamp - timestamp;
      setTimeout(this.onTimer, timeout);
    }
  }

  private isInInterval(value: number, from: number, to: number) {
    if (from === to) {
      return false;
    } else if (from < to) {
      if (from >= value || to <= value) {
        return true;
      }
    } else {
      if (from <= value || to >= value) {
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
    console.log('RefreshController.startAutoRefresh');
    if (this.timer) {
      return;
    }
    this.setNextTimer();
  }

  private stopAutoRefresh() {
    console.log('RefreshController.stopAutoRefresh');
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}