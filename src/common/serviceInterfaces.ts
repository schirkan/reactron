import { IModuleRepositoryItem, ICommandResult, IReactronService } from "@schirkan/reactron-interfaces";

export interface IModuleController extends IReactronService {
  getModules(): Promise<IModuleRepositoryItem[]>;
  addModule(repository: string): Promise<ICommandResult[]>;
  deleteModule(moduleName: string): Promise<ICommandResult[]>;
  rebuildModule(moduleName: string): Promise<ICommandResult[]>;
  updateModule(moduleName: string): Promise<ICommandResult[]>;
  checkUpdates(): Promise<ICommandResult[]>;
}
