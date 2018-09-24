import { ISystemSettings } from "../../../../../interfaces/ISystemSettings";

export interface ISettingsCardProps {
  settings: ISystemSettings;
  onSave: (newSettings: ISystemSettings) => any;
}