import { ILogWriter, IPubSub, topicNames, Severity } from "@schirkan/reactron-interfaces";

export class LogWriter implements ILogWriter {
  constructor(private topics: IPubSub, public readonly source: string) { }

  private log(severity: Severity, message: string, data?: any): void {
    this.topics && this.topics.publish(topicNames.log, { source: this.source, severity, message, data });
  }

  public error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  public warning(message: string, data?: any): void {
    this.log('warning', message, data);
  }

  public info(message: string, data?: any): void {
    this.log('information', message, data);
  }

  public debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }
}