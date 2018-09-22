import { IModuleRepositoryItem } from '../../../../../interfaces/IModuleRepositoryItem';
export interface IModuleCardProps {
  module: IModuleRepositoryItem;
  onUpdate: (module: IModuleRepositoryItem) => void;
  onRebuild: (module: IModuleRepositoryItem) => void;
  onRemove: (module: IModuleRepositoryItem) => void;
}