export interface ICommandResult<TData = void> {
    command: string;
    args: string;
    success: boolean;
    timestampStart: number;
    timestampEnd: number;
    log: string[];
    data?: TData;
    children: ICommandResult[];
}