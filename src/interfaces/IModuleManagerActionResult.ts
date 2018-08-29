export interface IModuleManagerActionResult {
    command: string; // (add, update, install, build, remove) 
    args: string;
    success: boolean;
    timestampStart: number;
    timestampEnd: number;
    log: string;
    children: IModuleManagerActionResult[] | null;
}