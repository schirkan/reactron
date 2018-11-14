import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { IFieldDefinition } from "@schirkan/reactron-interfaces";

export interface IOptionCardProps {
  className?: string;
  icon: IconProp;
  title: string;
  options: object;
  fields: IFieldDefinition[];
  onSave: (newOptions: object) => any;
  onCancel?: () => any;
  showReset?: boolean;
}