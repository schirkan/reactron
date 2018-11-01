import { IUiComponentProps } from "../IUiComponentProps";

export interface IUiButtonProps extends IUiComponentProps {
  disabled?: boolean;
  onClick?: () => any;
}