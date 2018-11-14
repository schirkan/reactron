import { IWebPageOptions } from "@schirkan/reactron-interfaces";

export interface IPageCardProps {
  page: IWebPageOptions;
  onEdit: (page: IWebPageOptions) => any;
  onDelete: (page: IWebPageOptions) => any;
}