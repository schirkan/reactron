import { ILogController, ILogEntry } from '@schirkan/reactron-interfaces';
import { BackendService } from '../BackendService';

export class LogController implements ILogController {
  public async start(): Promise<void> { }

  public async getLogEntries(source?: string): Promise<ILogEntry[]> {
    return BackendService.instance.logManager.readLog(source);
  }
}