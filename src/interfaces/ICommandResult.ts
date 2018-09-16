export interface ICommandResult {
    command: string;
    args: string;
    success?: boolean;
    timestampStart: number;
    timestampEnd: number;
    log: string[];
    children: ICommandResult[];
}

export interface ICommandResultWithData<TData> extends ICommandResult {
    data: TData;
}