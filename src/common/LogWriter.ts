import { ILogWriter, ILogManager } from "@schirkan/reactron-interfaces";

export class LogWriter implements ILogWriter {
  constructor(private logManager: ILogManager, public readonly source: string) { }

  error(message: string, data?: any): void {
    this.logManager && this.logManager.writeLog(this.source, 'error', message, data);
  }

  warning(message: string, data?: any): void {
    this.logManager && this.logManager.writeLog(this.source, 'warning', message, data);
  }

  info(message: string, data?: any): void {
    this.logManager && this.logManager.writeLog(this.source, 'information', message, data);
  }

  debug(message: string, data?: any): void {
    this.logManager && this.logManager.writeLog(this.source, 'debug', message, data);
  }
}