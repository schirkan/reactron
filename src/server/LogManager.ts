import { ILogManager, ILogEntry } from "@schirkan/reactron-interfaces";

export class LogManager implements ILogManager {
  private repository: ILogEntry[] = [];

  public writeLog(sourceOrLogEntry: any, severity?: any, message?: any, data?: any): void {
    if (typeof sourceOrLogEntry === 'string') {
      this.repository.push({
        timestamp: Date.now(),
        source: sourceOrLogEntry,
        severity,
        message,
        data
      });
      console.log(sourceOrLogEntry + ': ' + message); // TODO
    } else if (typeof sourceOrLogEntry === 'object') {
      const i = sourceOrLogEntry as ILogEntry;
      this.writeLog(i.source, i.severity, i.message, i.data);
    } else {
      console.log('LogManager: Parameter sourceOrLogEntry is missing!', arguments);
    }
  }

  public readLog(source?: string): ILogEntry[] {
    if (source) {
      this.repository.filter(x => x.source === source);
    }
    return this.repository;
  }
}