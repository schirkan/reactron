import { ICommandResult } from "./ICommandResult";

export interface IModuleDefinition {
    folder: string;
    name: string;
    description: string;
    author: string | { name?: string, email?: string };
    repository: string;
    browserFile: string;
    serverFile: string;
    isInstalled: boolean | null;
    isBuilded: boolean | null;
    canUpdaten: boolean | null;
    canBuild: boolean | null;
    commandLog: ICommandResult[];
}