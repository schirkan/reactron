import { ICommandResult } from '../../../../../interfaces/ICommandResult';
export interface ICommandResultProps {
  results: ICommandResult[];
  onClose: () => void;
}