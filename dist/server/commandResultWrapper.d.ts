import { ICommandResultWithData } from "../interfaces/ICommandResult";
export declare const command: <T = void>(commandName: string | undefined, args: any, callback: (result: ICommandResultWithData<T>) => T | ICommandResultWithData<T> | Promise<T> | Promise<ICommandResultWithData<T>>) => Promise<ICommandResultWithData<T>>;
