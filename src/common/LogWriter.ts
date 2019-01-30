import { ILogWriter, IPubSub, topicNames, Severity } from "@schirkan/reactron-interfaces";

export class LogWriter implements ILogWriter {
  constructor(private topics: IPubSub, public readonly source: string) { }

  private log(severity: Severity, message: string, data?: any): void {
    this.topics && this.topics.publish(topicNames.log, { source: this.source, severity, message, data });
  }

  public error(message: string, data?: any): void {
    this.log('error', message, LogWriter.prepareData(data));
  }

  public warning(message: string, data?: any): void {
    this.log('warning', message, LogWriter.prepareData(data));
  }

  public info(message: string, data?: any): void {
    this.log('information', message, LogWriter.prepareData(data));
  }

  public debug(message: string, data?: any): void {
    this.log('debug', message, LogWriter.prepareData(data));
  }

  private static prepareData(data?: any) {
    if (data instanceof Error) {
      return {
        // Pull all enumerable properties, supporting properties on custom Errors
        ...data,
        // Explicitly pull Error's non-enumerable properties
        name: data.name,
        message: data.message,
        stack: data.stack
      };
    }
    return data;
  }
}