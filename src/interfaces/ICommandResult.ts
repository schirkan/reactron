export interface ICommandResult<TData = void> {
    command: string; // (add, update, install, build, remove) 
    args: string;
    success: boolean;
    timestampStart: number;
    timestampEnd: number;
    message: string;
    data: TData;
    children: ICommandResult[] | null;
}