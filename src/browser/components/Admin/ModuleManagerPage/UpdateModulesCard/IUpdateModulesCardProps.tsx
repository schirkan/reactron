import { IModuleRepositoryItem } from "../../../../../interfaces/IModuleRepositoryItem";

export interface IUpdateModulesCardProps {
  checkingUpdates: boolean;
  modules: IModuleRepositoryItem[];
  onCheckUpdates: () => void;
  onUpdateAll: () => void;
  onUpdateModule: (module: IModuleRepositoryItem) => void;
}