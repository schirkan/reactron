import { ICommandResult } from "./ICommandResult";

export interface IModuleRepositoryItem {
    name: string;
    folder: string;
    path: string;
    description: string;
    author: string | { name?: string, email?: string };
    repository?: string;
    browserFile?: string;
    serverFile?: string;
    isInstalled?: boolean;
    isBuilded?: boolean;
    canUpdate?: boolean;
    canInstall?: boolean;
    canBuild?: boolean;
    canRemove?: boolean;
    commandLog: ICommandResult[];
}