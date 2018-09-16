import { ICommandResult } from "./ICommandResult";

export interface IModuleRepositoryItem {
    name: string;
    folder: string;
    path: string;
    description: string;
    version?: string;
    author: string | { name?: string, email?: string };
    repository?: string;
    browserFile?: string;
    serverFile?: string;
    isInstalled?: boolean;
    isBuilded?: boolean;
    hasUpdates?: boolean;
    canUpdate?: boolean;
    canInstall?: boolean;
    canBuild?: boolean;
    canRemove?: boolean;
}