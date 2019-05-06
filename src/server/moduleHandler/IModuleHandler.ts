import { ICommandResult, ICommandResultWithData, IModuleRepositoryItem } from '@schirkan/reactron-interfaces';

export interface IModuleHandler {
  canAdd(repository: string): Promise<boolean>;
  canRemove(moduleDefinition: IModuleRepositoryItem): Promise<boolean>;
  canUpdate(moduleDefinition: IModuleRepositoryItem): Promise<boolean>;

  add(repository: string): Promise<ICommandResultWithData<IModuleRepositoryItem | undefined>>;
  remove(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult>;
  hasUpdate(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResultWithData<boolean>>;
  update(moduleDefinition: IModuleRepositoryItem): Promise<ICommandResult>;

  loadAllModules(): IModuleRepositoryItem[];
  updateAllModules?(): Promise<ICommandResult>;
}
