import { IWebPageOptions } from "../../../../../interfaces/IWebPageOptions";

export interface IPageCardProps {
  page: IWebPageOptions;
  onEdit: (page: IWebPageOptions) => any;
  onDelete: (page: IWebPageOptions) => any;
}