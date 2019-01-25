"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const reactron_interfaces_1 = require("@schirkan/reactron-interfaces");
class RefreshController {
    constructor(context) {
        this.context = context;
        this.restart = this.restart.bind(this);
        this.onTimer = this.onTimer.bind(this);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // subscribe to settings changes
            this.context.topics.subscribe(reactron_interfaces_1.topicNames.systemSettingsUpdated, this.restart);
            this.startAutoRefresh();
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context.topics.unsubscribe(reactron_interfaces_1.topicNames.systemSettingsUpdated, this.restart);
            this.stopAutoRefresh();
        });
    }
    onTimer() {
        this.context.log.debug('onTimer');
        clearTimeout(this.timer);
        this.context.topics.publish(reactron_interfaces_1.topicNames.refresh);
        this.setNextTimer();
    }
    setNextTimer() {
        const now = new Date();
        const timeInMinutes = (now.getHours() * 60) + now.getMinutes();
        const timestamp = now.getTime();
        const timestampToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        let nextRefreshTimestamp = 0;
        this.context.settings.autorefresh.forEach(item => {
            let tempNextRefreshTimestamp = 0;
            if (this.isInInterval(timeInMinutes, +item.from, +item.to)) {
                tempNextRefreshTimestamp = timestamp + (item.interval * 60 * 1000);
            }
            else {
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
    isInInterval(value, from, to) {
        if (from === to) {
            return false;
        }
        else if (from < to) {
            if (value >= from && value <= to) {
                return true;
            }
        }
        else {
            if (value >= from || value <= to) {
                return true;
            }
        }
        return false;
    }
    restart() {
        this.stopAutoRefresh();
        this.startAutoRefresh();
    }
    startAutoRefresh() {
        this.context.log.debug('startAutoRefresh');
        if (this.timer) {
            return;
        }
        this.setNextTimer();
    }
    stopAutoRefresh() {
        this.context.log.debug('stopAutoRefresh');
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
}
exports.RefreshController = RefreshController;
//# sourceMappingURL=RefreshController.js.map