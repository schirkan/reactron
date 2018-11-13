import { ICommandResult } from '../interfaces/ICommandResult';
export declare class SystemCommand {
    static run(command: string, cwd: string): Promise<ICommandResult>;
}
