import { IServiceRepositoryItem } from '../../../../../interfaces/IServiceRepositoryItem';

export interface IServiceCardProps {
  service: IServiceRepositoryItem;
  onShowLog: (service: IServiceRepositoryItem) => void;
  onShowOptions: (service: IServiceRepositoryItem) => void;
}