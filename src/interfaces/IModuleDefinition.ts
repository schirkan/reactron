export interface IModuleDefinition {
    folder: string;
    name: string;
    description: string;
    author: string;
    repository: string;
    browserFile: string;
    serverFile: string;
    isInstalled: boolean | null;
    isBuilded: boolean | null;
    canUpdaten: boolean | null;
    canBuild: boolean | null;
}