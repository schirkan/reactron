import * as fs from 'fs';
import * as path from 'path';
import { IBackendServiceConfig } from '../interfaces/IBackendServiceConfig';
import { IModuleDefinition } from "../interfaces/IModuleDefinition";

export class ModuleLoader {
    private modulesPath: string;

    constructor(
        private config: IBackendServiceConfig
    ) {
        this.modulesPath = path.join(this.config.root, 'modules');
    }

    public async loadAllModules(): Promise<IModuleDefinition[]> {
        return new Promise<IModuleDefinition[]>((resolve) => {
            const result: IModuleDefinition[] = [];
            fs.readdir(this.modulesPath, async (err, items) => {
                console.log('modules', items);
                for (const item of items) {
                    const newModule = await this.loadModule(item);
                    if (newModule) {
                        result.push(newModule);
                    }
                }
            });
            resolve(result);
        });
    }

    public async loadModule(folderName: string): Promise<IModuleDefinition | null> {
        const packageFile = path.join(this.modulesPath, folderName, 'package.json');
        let p: any;
        try {
            const fileContent = fs.readFileSync(packageFile, { encoding: 'utf-8' });
            p = JSON.parse(fileContent);
            console.log(packageFile, p);
        } catch (error) {
            console.log('Error reading package.json', error);
            return null;
        }

        const module = {
            folder: folderName,
            name: p.name,
            description: p.description,
            author: p.author,
            repository: p.repository && p.repository.url,
            isBuilded: true
        } as IModuleDefinition;

        module.commandLog = [];

        if (p.browser) {
            module.browserFile = './' + path.join('modules', folderName, p.browser);
            if (!fs.existsSync(path.join(this.config.root, module.browserFile))) {
                module.isBuilded = false;
            }
        }

        if (p.main) {
            module.serverFile = './' + path.join('modules', folderName, p.main);
            if (!fs.existsSync(path.join(this.config.root, module.serverFile))) {
                module.isBuilded = false;
            }
        }

        if (!module.browserFile && !module.serverFile) {
            console.log('No module in folder ' + folderName);
            return null;
        }

        module.canBuild = p.scripts && !!p.scripts.build;
        module.canUpdaten = !!module.repository;
        module.isInstalled = fs.existsSync(path.join(this.config.root, 'modules', 'node_modules'));

        console.log(folderName, module);
        return module;
    };
}