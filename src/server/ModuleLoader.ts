import * as fs from 'fs';
import * as path from 'path';
import { IBackendServiceConfig } from '../interfaces/IBackendServiceConfig';
import { IModuleRepositoryItem } from "../interfaces/IModuleRepositoryItem";

export class ModuleLoader {
    private modulesPath: string;

    constructor(
        private config: IBackendServiceConfig
    ) {
        this.modulesPath = path.join(this.config.root, 'modules');
    }

    public async loadAllModules(): Promise<IModuleRepositoryItem[]> {
        return new Promise<IModuleRepositoryItem[]>(async (resolve, reject) => {
            const result: IModuleRepositoryItem[] = [];

            try {
                const items = fs.readdirSync(this.modulesPath);
                for (const item of items) {
                    const moduleFolderFull = path.join(this.modulesPath, item);
                    if (fs.statSync(moduleFolderFull).isDirectory()) {
                        const newModule = await this.loadModule(item);
                        if (newModule) {
                            result.push(newModule);
                        }
                    }
                }
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    public async loadModule(folderName: string): Promise<IModuleRepositoryItem | null> {
        const packageFile = path.join(this.modulesPath, folderName, 'package.json');
        let p: any;
        try {
            const fileContent = fs.readFileSync(packageFile, { encoding: 'utf-8' });
            p = JSON.parse(fileContent);
            console.log('reading ' + packageFile);
        } catch (error) {
            console.log('Error reading package.json', error);
            return null;
        }

        const moduleDefinition = {
            folder: folderName,
            path: path.join(this.modulesPath, folderName),
            name: p.name,
            description: p.description,
            author: p.author,
            repository: p.repository && p.repository.url,
            isBuilded: true
        } as IModuleRepositoryItem;

        moduleDefinition.commandLog = [];

        if (p.browser) {
            moduleDefinition.browserFile = './' + path.join('modules', folderName, p.browser);
            if (!fs.existsSync(path.join(this.config.root, moduleDefinition.browserFile))) {
                moduleDefinition.isBuilded = false;
            }
        }

        if (p.main) {
            moduleDefinition.serverFile = path.join(this.config.root, 'modules', folderName, p.main);
            if (!fs.existsSync(moduleDefinition.serverFile)) {
                moduleDefinition.isBuilded = false;
            }
        }

        if (!moduleDefinition.browserFile && !moduleDefinition.serverFile) {
            console.log('No module in folder ' + folderName);
            return null;
        }

        moduleDefinition.canBuild = p.scripts && !!p.scripts.build;
        moduleDefinition.canUpdate = !!moduleDefinition.repository;
        moduleDefinition.canInstall = true; // TODO
        moduleDefinition.canRemove = true; // TODO
        moduleDefinition.isInstalled = fs.existsSync(path.join(this.config.root, 'modules', folderName, 'node_modules'));

        console.log('Module loaded: ' + moduleDefinition.name);
        return moduleDefinition;
    };
}